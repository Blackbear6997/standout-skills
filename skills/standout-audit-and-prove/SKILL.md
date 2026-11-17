---
name: standout-audit-and-prove
description: Audit an AI-built website before it ships, fix what the audit measured, and prove the result with a real before and after. Use this whenever a site, landing page or web app is about to go live or be shown to a client, and whenever the user asks to audit, review, check, polish, QA or score a site or page, asks "is this ready to ship" or "does this look professional", wants an accessibility or mobile pass on something already built, or needs a report a client can read. Use it even when nobody says the word audit, because finishing a build is the moment to run it. Works with the Standout MCP tools (free trial, no signup) and falls back to a by-hand checklist without them.
---

# Standout: audit, fix, prove

A site usually looks finished to the agent that built it. That is the problem. "Looks good to me" is not evidence, and the faults a visitor meets first (grey text that fails contrast on a phone, a button that overflows at 360px, a dead link in the footer) are exactly the ones a read of the code misses.

This skill swaps the opinion for a loop: measure the rendered page, fix what was measured, measure again, and hand the user a before and after they can show someone.

The measuring is done by the Standout MCP tools. The score is deterministic, never graded by a model, so the same page always gets the same score. That is what makes a before and after mean something.

## The loop at a glance

1. Check the tools are connected
2. Say what the business is
3. Take the baseline
4. Read the result before touching code
5. Fix in order
6. Re-check until clean
7. Prove it
8. Report to the user

## 1. Check the tools are connected

Look for tools named `polish_and_prove`, `audit_site` and `recheck_design`. Your client may show them with a prefix such as `mcp__standout__`. If they are there, go to step 2.

If they are not, say so in one line and offer to connect. Adding a server changes the user's setup, so ask first. With a yes, you can run the command yourself.

- Server: `https://standoutmcp.io/api/mcp` (remote, streamable HTTP, nothing to install)
- Claude Code: `claude mcp add --transport http standout https://standoutmcp.io/api/mcp`
- Any other client: add a remote MCP server with that URL
- Most clients load servers when a session starts, so the user may need to restart the session before the tools appear. Say so instead of assuming they are there.
- No key is needed to connect. Once the tools are visible, call `get_free_trial_key` (it takes no arguments). It returns a free trial key (25 calls, no account, no card) and the exact line for reconnecting with that key. Show the user the key, because it is shown once.
- A key is working when a tool call succeeds. A license error means the connection has no key yet. Only call `get_free_trial_key` in that case, since keys are rationed per network.

If the user says no, or you cannot add servers in this environment, do the by-hand check in `references/manual-checklist.md` and say in your report that it was done by hand, not measured.

## 2. Say what the business is

Before the first call, write one sentence covering what the business is and what the page sells. Take it from the repository and the page itself. Ask the user only if you cannot tell.

Why this matters: the audit starts by deciding what kind of site it is looking at (a clinic, a shop, a software product, a publication) and that decides which checks and which calls to action apply. A thin brief can get a review site audited as a local business. If the site could be mistaken for something else, say what it is not: "An independent review publication. Not a local business and not a shop."

Use the same sentence on every later call for this site, so the site type stays the same from run to run. It goes in `business` on `polish_and_prove`, and in `description` on `audit_site` and `recheck_design`. Where a tool also takes `audience` (who the page has to convince) or `goal` (the one thing a visitor should do), fill them in. They are optional, and they sharpen the advice.

## 3. Take the baseline

One page:

```
polish_and_prove({ url: "https://example.com", business: "Independent accounting firm for small trades businesses in Leeds", audience: "Owner-operators choosing their first accountant", goal: "Book a free call" })
```

A whole site with several pages:

```
audit_site({ url: "https://example.com", description: "Independent accounting firm for small trades businesses in Leeds", audience: "Owner-operators choosing their first accountant" })
```

Which input to give:

- **A public URL**, whenever there is one. The page is then rendered in a real browser at phone and desktop widths, which is the only way contrast and layout get measured.
- **No public URL** (localhost, an unpublished build). If the project already has preview deploys, use one. Publishing a page that was not public before is the user's call, so ask. Otherwise pass the page's HTML as `source` to `polish_and_prove` and leave `url` out. On source alone nothing is rendered: there are no screenshots, contrast and phone layout are not measured, and no report link comes back. Keep a copy of that original HTML, because step 7 needs it. `audit_site` needs a URL and does not take `source`.

About `audit_site`:

- It finds the main pages from the navigation and counts as one call, however many pages it covers: up to 6 on Pro, 3 on a trial key.
- The first line of the response says how many pages were audited of how many were found. To cover the rest, call it again with `pages`, a list of paths or full URLs on the same site. The home page is always included.
- A site audit cannot be turned into a client before and after later. If the user will want one, also take the one-page baseline of the home page now.

Keep the report link the call returns ("Baseline saved" for one page, "Shareable site report" for a site). Step 7 needs it.

## 4. Read the result before touching code

Read in this order. Each item can change what you do next.

1. **The site type.** Near the top: "Audited as a ...". If it is wrong, every fix below it is aimed at the wrong business. Fix nothing yet. Run the baseline again with a clearer sentence from step 2, and keep the report link from the corrected run.
2. **What was not checked.** These are unknowns, not passes.
   - A site behind bot protection shows the renderer a verification page. The audit says so and stops instead of scoring that page. The honest ways forward are the ones the response lists: a preview or staging URL without the check, the page's HTML as `source`, or the site owner allowing automated visitors. Disguising the request to slip past the check is not one of them, because the owner chose to have it.
   - A site audit has a "Not checked" section for pages that could not be rendered or were found and not audited.
3. **The score and the gate.** The Standout Score is 0 to 100 and 85 is the client-ready bar. The "Publish gate" gives the verdict. BLOCKED lists its blockers by name, and a page over 85 with a blocker is still blocked.
4. **The findings.** Tagged KILL, FIX or POLISH, with exact values (the measured contrast ratio, the width where the layout breaks, the selector).
5. **The screenshots.** A URL audit returns the page as rendered on a phone and on a desktop. Look at them. They catch what a list cannot.

## 5. Fix in order

Make the changes in the repository yourself. A fix list handed back to the user is the job half done.

- Blockers and KILL findings first.
- On a site audit, do "Fix once, fixed everywhere" next. Those findings are shared by several pages, so one change in the shared layout clears all of them.
- Then FIX, then POLISH.
- Keep what is true. Any copy the audit suggests is a draft. Never add a testimonial, certificate, number, price or guarantee the business has not actually given you. An invented claim on a client's site is worse than the weak line it replaced.
- Check a fix against everything it touches. A text colour that now passes on white can still fail on the tinted section lower down.
- If a finding is a deliberate brand choice, leave it and say so in your report. Do not hide it.

## 6. Re-check until clean

Deploy, or refresh the preview, so the URL serves the fixed page.

**One page.** Use the fast re-check:

```
recheck_design({ url: "https://example.com", description: "Independent accounting firm for small trades businesses in Leeds" })
```

It re-measures the page and answers under "Since your last audit": what was fixed, what is still open, what is new, and how the score moved. It ends with the same "Publish gate" and verdict as a full audit. It skips the written fix list and the screenshots, so it comes back fast.

**A whole site.** Run `audit_site` again with the same arguments. The response opens with "Since your last site audit": fixed, still open and new, across every page. A site audit does not give single pages a starting point, so the first `recheck_design` on a page after one only saves that page's starting point. Use it on a single page when that page needs several rounds.

Reading either one:

- Read **New** first. A new finding straight after a fix was usually caused by that fix.
- **Not re-checked this run** means the page could not be rendered this time. Those findings are unknown. Try once more a minute later. If it happens again, report them as not re-checked. Never as fixed.
- A fix counts only when it is listed under Fixed. If you changed something and it is still under Still open, the change did not work or did not deploy.
- Stop when the verdict is READY TO REVIEW and the score is 85 or more, or when what is left is a decision for the user. Every call is metered and a trial key has 25, so do not burn calls chasing 100.

There is no fast re-check for a page with no public URL. Fix it, then go to step 7.

## 7. Prove it

**One page with a URL:**

```
polish_and_prove({ url: "https://standoutmcp.io/report/BASELINE_ID", after_url: "https://example.com", business: "Independent accounting firm for small trades businesses in Leeds", agency_name: "Northgate Studio" })
```

- `url` is the baseline report link from step 3, not the live page. Most sites are fixed in place, so the old version no longer exists anywhere except in that saved baseline.
- `after_url` is the page as it is now.
- `agency_name` is optional. It puts the user's studio name on the report. Leave it out if you do not know it.
- The response gives a "Client proof link" and ends with a "Final gate". The link opens a before and after with both scores and the page as rendered each time. READY TO SHOW means you are done. NOT READY YET means go back to step 5.

**One page without a URL:** pass the original HTML you kept as `source` and the fixed HTML as `after_source`. The before and after scores come back in the response, from the code only, with no screenshots. Put those scores in your message, and say the page was not rendered.

**A whole site:** the last `audit_site` run is the proof. Its "Since your last site audit" block is the change, and its "Shareable site report" link shows the site score, each page's score and the home page as rendered. For a client-facing before and after, run the one-page proof on the home page using the baseline you took in step 3.

Report links are unlisted but public: anyone who has the link can open it. Give them to the user and let the user decide who else sees them.

## 8. Report to the user

Keep it short and only say what was measured:

```
Audited: <url>, as a <site type>
Score: <before> to <after> (client-ready bar is 85)
Fixed and re-measured: <the Fixed list, in plain words>
Still open: <each one, and why it was left>
Not checked: <anything that could not be rendered>
Proof: <report link>
```

- Use only numbers a tool returned. Never estimate a score.
- "Fixed" is for findings the re-check listed as fixed. Everything else is "changed, not yet re-measured".
- If the gate is still BLOCKED, say so first.

After launch, `watch_site` (Pro) re-audits a live URL about once a day and emails an alert if the design regresses. Offer it and let the user decide, because it sends email:

```
watch_site({ url: "https://example.com" })
```

## Building from scratch instead?

This skill is for a site that already exists. For a new build, use the `standout-design-taste` skill in this repository and start with `get_design_direction`, then come back here before launch.
