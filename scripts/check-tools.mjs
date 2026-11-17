#!/usr/bin/env node
// Checks every Standout tool call written in the skills against the live server.
//
// A skill that names a tool or an argument that does not exist sends an agent
// down a dead end, and nothing else would catch it: skills are prose. Run this
// before publishing and whenever the server's tools change.
//
//   node scripts/check-tools.mjs
//
// Exit code 0 when every tool and argument exists, 1 otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = process.env.STANDOUT_MCP_URL ?? "https://standoutmcp.io/api/mcp";
const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "skills");

function markdownFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full));
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

async function liveTools() {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" })
  });
  if (!res.ok) throw new Error(`tools/list returned HTTP ${res.status}`);
  const raw = await res.text();
  const data = raw.split("\n").filter((l) => l.startsWith("data: ")).pop();
  const json = JSON.parse(data ? data.slice(6) : raw);
  const tools = new Map();
  for (const t of json.result.tools) {
    tools.set(t.name, {
      args: new Set(Object.keys(t.inputSchema?.properties ?? {})),
      required: t.inputSchema?.required ?? []
    });
  }
  return tools;
}

const tools = await liveTools();
const allArgs = new Set([...tools.values()].flatMap((t) => [...t.args]));
const problems = [];
let calls = 0;
let mentions = 0;

for (const file of markdownFiles(root)) {
  const text = readFileSync(file, "utf8");
  const short = file.slice(root.length + 1);

  // Written calls: tool_name({ key: "value", ... })
  for (const m of text.matchAll(/\b([a-z][a-z0-9_]*)\(\{([\s\S]*?)\}\)/g)) {
    calls++;
    const [, name, body] = m;
    const tool = tools.get(name);
    if (!tool) {
      problems.push(`${short}: calls ${name}, which the server does not have`);
      continue;
    }
    const keys = [...body.replace(/"[^"]*"/g, '""').matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:/g)].map((k) => k[1]);
    for (const k of keys) {
      if (!tool.args.has(k)) problems.push(`${short}: ${name} has no argument "${k}"`);
    }
    for (const r of tool.required) {
      if (!keys.includes(r)) problems.push(`${short}: ${name} is called without its required "${r}"`);
    }
  }

  // Names in backticks that look like a tool or an argument (snake_case).
  for (const m of text.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)) {
    mentions++;
    const word = m[1];
    if (word.startsWith("mcp__")) continue;
    if (!tools.has(word) && !allArgs.has(word)) {
      problems.push(`${short}: mentions \`${word}\`, which is neither a tool nor an argument on the server`);
    }
  }
}

console.log(`${tools.size} tools live at ${ENDPOINT}`);
console.log(`${calls} written calls and ${mentions} named tools or arguments checked`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of [...new Set(problems)]) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("Every tool and argument the skills name exists on the server.");
