# Red Mechanical — marketing site

A single-page static site built from the design handoff in
`red mechanical.zip` (`handoff_red_mechanical/Red Mechanical.dc.html`).

**No build step, no npm, no framework.** Three files you can edit by hand.

## How to look at it

Double-click `index.html` — it opens in your browser and works.

If you'd rather use a local web server (closer to how it will behave live):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's where

| File | What it holds |
|---|---|
| `index.html` | All the page content and copy |
| `assets/css/styles.css` | All the styling. Design tokens are at the very top in `:root` |
| `assets/js/main.js` | Scroll animations, the mobile menu, the counters, the form |
| `assets/img/` | Photography (WebP) |
| `assets/favicon.svg` | The little red square in the browser tab |

### Things you're most likely to want to change

- **Text** — in `index.html`. It's plain HTML; find the words and type over them.
- **The brand red** — one line, `--red` at the top of `styles.css`. Change it there
  and it updates everywhere (buttons, ticker, accents, favicon aside).
- **Phone number** — appears in four places in `index.html`. Search for `782-1302`.
- **A project row** — copy an existing `<div class="record__row">` block and edit it.

`main.js` is purely additive: delete it and the page still renders completely and
every link still works. Same for animations — anyone with "reduce motion" turned
on in their OS gets a still version automatically.

## Deploying

Because it's static, upload the whole folder anywhere:

- **Netlify** — drag the folder onto app.netlify.com/drop
- **GitHub Pages** — repo Settings → Pages → deploy from this branch, root folder
- **Any web host** — upload via FTP into the public folder

## Before it goes live

These are open items carried over from the design handoff, plus a couple added
while building. None of them break the site — it works as-is — but they should be
settled before you point a real domain at it.

1. **Sample the exact brand red from the logo.** `--red: #D7261E` in
   `styles.css` is the handoff's approximation, not the real brand colour.
2. **Replace the photography.** Every image in `assets/img/` is AI-generated
   placeholder imagery from the handoff, not real job-site photos.
3. **Wire up the bid-request form.** Right now the form does *not* send anywhere
   — it only swaps the button label to "Received". A real visitor would be told
   their enquiry arrived when it didn't, so either connect it or remove it.
   Easiest route: sign up for a form service (Formspree, Netlify Forms, Basin),
   then in `index.html` add their URL as the form's `action` and `method="POST"`,
   and delete the `form.addEventListener('submit', ...)` block at the bottom of
   `main.js` so the browser submits normally.
4. **Decide about the Virtual Tours section.** The "Open the tours" button
   currently links back to itself (`#tours`) because the real tour viewer URL
   isn't known. Either point it at the live tour, or delete the whole
   `<section id="tours">` block plus the two nav links to it.
5. **Confirm the canonical URL.** `index.html` assumes
   `https://www.redmechanical.com/` in the `<link rel="canonical">` and the
   Open Graph tags. Correct it if the live domain differs.
6. **Add analytics** if you want traffic stats (one script tag before `</body>`).

## Notes on the build

- The handoff's images were 23 MB of PNGs. They're converted to WebP here
  (1.6 MB total, same dimensions) so the page loads quickly. The original PNGs
  are still in `red mechanical.zip` if you ever need them.
- Everything in the design was an inline style; those were converted to real CSS
  classes with the token table in `:root`, as the handoff asked.
- The JS-driven hover effects in the prototype (card invert, row indent, gallery
  zoom) are plain CSS `:hover` rules here — less code, and they work faster.
- Added beyond the design: page title and meta description, Open Graph tags,
  a favicon, a "skip to content" link, visible keyboard focus rings, `alt` text
  on every image, and a two-line stacked layout for the project table on phones
  (its four columns don't fit below ~760px).
