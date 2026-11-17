# By-hand pre-launch check

Use this when the Standout tools are not connected. It covers the same ground with the tools you already have. It is slower and it is a check by hand, not a measurement, so say that in your report: "Checked by hand. No rendered measurement was taken."

Work through it on the real page, not on memory of the code you wrote. If you have a browser tool, render the page. If you do not, say which sections you could only read from source.

## 1. Phone first

Render at 360px, 390px and 768px wide.

- No sideways scroll at any of the three widths
- Nothing cut off, overlapping or running out of its box (long words, buttons, tables, code blocks)
- At least 20px between text and the screen edge
- Every button and link is at least 44px tall and wide enough to tap
- The page has `<meta name="viewport" content="width=device-width, initial-scale=1">`
- The first screen says what the business is and offers the main action without scrolling
- The hero uses `min-height: 100dvh` or less, not a fixed `100vh` that hides content behind the phone's toolbar

## 2. Can it be read

- Body and label text reaches a 4.5:1 contrast ratio against the background it actually sits on. Large headings need 3:1. Work it out with the WCAG formula from the real computed colours, including text over images and tinted sections. Guessing by eye is how this fails.
- Body text is 16px or larger on a phone
- Lines of body text run to about 45 to 75 characters on desktop, not the full width of a wide screen
- Two type families at most

## 3. Is it true

- No placeholder text, sample names or lorem ipsum
- Every number, testimonial, logo, certificate, price and guarantee came from the business. If you cannot say where it came from, take it out.
- The copy says what the business does, for whom, and what happens next. Cut the filler words that could sit on any site.
- Images show the real business or are clearly illustrative. No stock photo passed off as the team.

## 4. Does it work

- Every link and button goes somewhere real. Search the source for `href="#"` and empty `href`.
- Request each internal link and confirm none returns a 404
- Forms submit and show a success state and an error state
- Meaningful images have `width`, `height` and a descriptive `alt`. Decorative ones use `alt=""`.
- The page has one `<h1>`, a `<title>` and a meta description
- Animation uses `transform` and `opacity` and respects `prefers-reduced-motion`

## 5. Across the site

A single page cannot show these, so check every main page in the navigation.

- Every page has its own `<title>`. Repeated titles are a common fault on generated sites.
- Every page still has the navigation and the footer
- The same header, type and colours on every page
- No internal link on any page leads to a 404

## Reporting

List what you checked, what you changed, and what you could not check. Give no score: a score is only meaningful when it was measured the same way before and after.

To measure it, connect the Standout tools (remote MCP server at `https://standoutmcp.io/api/mcp`, free trial key through `get_free_trial_key`, no account or card) and go back to step 1 of the skill.
