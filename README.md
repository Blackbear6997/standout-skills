# Standout Skills

Free skills for AI coding agents, from [Standout](https://standoutmcp.io): audit an AI-built website before it ships, fix what was measured, and prove the result with a real before and after.

## Install

```bash
npx skills add Blackbear6997/standout-skills
```

Works with Claude Code, Cursor, Codex, and any agent that reads skill files.

## Skills

- **standout-audit-and-prove** - the pre-launch loop for a site that already exists. Take a measured baseline, read it honestly (site type, what could not be checked, the score and the gate), fix in order, re-check until clean, and finish with a before and after report the user can send to a client. Uses the Standout MCP tools when they are connected and a by-hand checklist when they are not.
- **standout-design-taste** - the anti-slop discipline for a new build: picks one real art direction from the free [DESIGN.md library](https://standoutmcp.io/directions), locks palette and type, and bans the recognizable AI tells (purple gradients, centered-everything heroes, three-card rows, fake proof, slop copy).

## The Standout MCP server

The skills are free and useful on their own. The measuring is done by the Standout MCP server: it renders the real page at phone and desktop widths, computes contrast and layout, scores the page 0 to 100 with a deterministic score (the same page always gets the same score), and tracks what was fixed, what is still open and what is new between runs.

```bash
claude mcp add --transport http standout https://standoutmcp.io/api/mcp
```

No signup is needed to connect. The agent can get its own free trial key (25 calls, no account, no card) by calling `get_free_trial_key`. Details: **https://standoutmcp.io**

## For maintainers

`node scripts/check-tools.mjs` checks every tool and argument the skills name against the live server. Run it before publishing a change.
