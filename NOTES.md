# Notes: `fix/polish`

Local commits only. **Nothing has been pushed or deployed.** The full redesign handover (design tokens, sources for every fact, Lighthouse results) is in git history: `git show 815d570:NOTES.md`.

## What changed

1. **Buttons centred.** Root cause: icons came from an external sprite (`assets/icons.svg`), which Chrome blocks when a page is opened from disk (`file://`). Every icon slot rendered empty, pushing labels off-centre. The sprite is now inlined in each page. All `.btn`s share one fixed height and padding with icon + label centred: download on Résumé, mail on Email, arrow on Live site, Send and the 404 button.
2. **Profile card.** The blank strip under the divider was the same missing-icon bug. GitHub, LinkedIn, X and Instagram (the links already on the site) are now round bordered buttons that fill with ink and lift slightly on hover.
3. **Work page glass hover.** Each project is a card. On hover *and* keyboard focus inside it, the card gets a translucent fill, `backdrop-filter: blur`, a light border and a 4px lift (250ms). Touch screens show the glass surface at rest with no hover needed. The lift is off under reduced motion.
4. **Corner arrow instead of "Source code".** A rose ↗ in each card's top-right corner links to the repo (new tab, `rel="noopener noreferrer"`, `aria-label="Open project: … on GitHub"`) and nudges on hover. Rose was already the site's single accent, so no new colour was added. Nazar keeps a separate "Live site" button so its live link isn't lost.
5. **Project cards.** Title + context, corner arrow, thumbnail, summary, then aligned Stack / Outcome rows, with the stack shown as tags. All seven projects already had a visual: three real screenshots and four original SVG covers.
6. **Toolkit logos.** Letter tiles replaced with self-hosted SVGs in `assets/icons/`: Simple Icons (CC0), plus Devicon (MIT) for Java, VS Code and MySQL. All are recoloured to the ink colour so they sit consistently in the light tiles. FAISS and Whisper have no official mark, so they use neutral original glyphs (vector search, waveform). Also applied to the Home tool list. Credits are in `assets/icons/README.txt`.
7. **"Let's work together" form** at the bottom of Home: Name, Email, Message and a full-width accent Send button. It uses Netlify Forms (`name="contact"`, `data-netlify`, hidden `form-name`, `bot-field` honeypot). JS validates inline and submits with `fetch`, then shows a success message without reloading. On failure it points to your email. Without JS it posts normally. The email link and copy button stay below as a fallback.

Also: Home links point at `index.html` (the old `./` broke navigation from disk), and a global `[hidden]` rule now wins over component `display` styles.

## Checked

Every page was checked with Playwright (Chromium) at 390, 768 and 1440px:
- Pages: Home, Work, About, Toolkit and 404.
- Layout: no horizontal overflow and no elements outside the viewport.
- Console and network: no console errors, no failed requests or 4xx responses.
- Assets: every icon reference resolves and every image loads.
- Links: all 37 internal links and anchors resolve.
- Reduced motion: nothing is hidden or animated.
- From disk (`file://`): icons and images render.
- External links: return 200, except LinkedIn (429, bot-blocking).
- Form: validation, failure message and success state were tested with a mocked response. A real submission only works once deployed on Netlify.

## What you need to do or provide

- **Enable form detection on Netlify** (Site configuration → Forms → Enable form detection) before deploying, or submissions won't be captured. Set up email notifications for the `contact` form there too.
- **Optional: a real screenshot** for Video Translation, Adaptive Diagnostic Engine, Self-Pruning NN and Deadline OS. They currently use original illustrations. Drop a 1280×800 WebP into `assets/img/` and swap the `src`.
- **Optional: more social links** (LeetCode, Codeforces, etc.). None exist in your sources, so none were added. Send the URLs and they slot into the card.
- **Still open from the redesign:** the "Placfv's SRM" spelling; whether the "– Present" roles are current; evidence for Adobe "Top 2%"; whether to delete `legacy/` before merging (it would be public at `/legacy/`).
- Fonts don't load when opening files from disk (a browser rule for `file://`). Use the local server below to see the real typography.

## Preview locally

```bash
python -m http.server 5173
# open http://localhost:5173
git log --oneline redesign/framer-style..fix/polish   # this branch's commits
```
