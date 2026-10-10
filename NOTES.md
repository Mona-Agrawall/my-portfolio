# Redesign notes: `redesign/framer-style`

Working log and handover for the portfolio rebuild. Everything here was done locally. **Nothing has been pushed or deployed.**

---

## 1. Preview, merge and deploy (your commands)

```bash
# Preview locally (any static server works; Python is already installed)
python -m http.server 5173
# then open http://localhost:5173

# Review the branch
git log --oneline main..redesign/framer-style
git diff main --stat

# Merge when happy
git checkout main
git merge --no-ff redesign/framer-style
git push origin main          # Netlify will redeploy from main if it is connected to the repo
```

No build step is needed. Netlify serves the folder as-is, and `404.html` at the root is picked up automatically. No Netlify config was added or changed.

**Before you deploy, consider:**
- `legacy/` holds the previous site so it stays recoverable, and it will be publicly reachable at `/legacy/` if deployed. Delete the folder before merging if you don't want that; git history keeps it either way.
- The old résumé URL `images/my-cv.pdf` no longer exists at the root. It now lives at `assets/docs/mona-agrawal-resume.pdf` (and still at `legacy/images/my-cv.pdf`).

---

## 2. Structure

```
index.html, projects.html, about.html, toolkit.html, 404.html
css/style.css          tokens, layout, components, motion
js/main.js             load sequence, reveals, Lenis, copy email, cursor label, clock
vendor/lenis.min.js    Lenis 1.1.13 (MIT), self-hosted
assets/fonts/          Bricolage Grotesque + Geist, variable WOFF2, latin subset (SIL OFL 1.1)
assets/img/            WebP screenshots, original SVG covers, portrait, og.png
assets/docs/           résumé + certificates
assets/icons.svg       sprite; brand glyphs from Simple Icons (CC0), UI glyphs original
legacy/                previous site, untouched apart from the move
```

No runtime CDN dependencies. Font Awesome and Google Fonts are gone.

---

## 3. Reference study: sawad.framer.website

Inspected with Playwright (Chromium) at 1440px and 390px: home, `/projects`, `/tools`; computed styles extracted.

| Aspect | Finding |
|---|---|
| Layout | ~1140px container (x 150→1290 at 1440). Left column: 344px **sticky** profile card (`top: 40px`). Right column ~700px, ~100px gutter. Mobile stacks the card first. |
| Nav | Small floating pill of icon buttons, centred at the top, dark translucent background. |
| Card | White card on a dark page with a large photo, name in heavy display type, one muted line and social icons. This high-contrast object anchors every page. |
| Headings | Two-line, all-caps, heavy Poppins 700 at 90–110px, line-height 1. Line 1 white, line 2 `rgba(182,180,189,.2)` (very low contrast). |
| Type | Poppins throughout (Inter in form fields). Body 18px/1.4, muted `#998f8f`. Titles 24–26px/600. |
| Colour | Background `#151312` (warm near-black), white text, warm muted grey, accent orange `#F46C38` plus a lime `#C5FF41` tile. Radii 8/16px. Surfaces `rgba(255,255,255,.03–.1)`. |
| Hero | Big heading → paragraph → three big stats (+12 / +46 / +20) → two coloured feature tiles. |
| Lists | Projects: 100px thumbnail + title + subtitle, arrow ↗ top-right in accent. Hover adds a soft surface background with an inset radius. Experience: title, paragraph, date. Tools: 2-col grid of white 48px icon tiles + name + one-line role. |
| Motion | Framer appear effects (opacity + small translate), `transition: all` on almost everything, subtle hover backgrounds. No scroll-jacking. |
| Weak points avoided | The second heading line fails contrast; all-caps everywhere; stats are template filler; icon-only nav has no labels. |

What I kept: the sticky contrast card plus scrolling column, two-tone headings, the stat row, thumbnail rows with an inset hover surface, and the tile + name + role tool grid.
What I changed: sentence-case headings, a dim line that passes AA for large text, a text-labelled nav, real metrics, and my own fonts, palette, copy, imagery and code.

---

## 4. Colour and type tokens

### Palette (dark is the only theme)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--ink` | `#121110` | page background | — |
| `--graphite` | `#1c1a18` | raised surfaces, hover rows | — |
| `--bone` | `#f3efe8` | primary text; also the profile card surface | 16.46:1 on ink, 15.14:1 on graphite |
| `--stone` | `#a39c92` | muted text | 6.94:1 on ink, 6.38:1 on graphite (AA) |
| `--hairline` | `#2c2926` | borders, dividers | decorative |
| `--rose` | `#ff5c7a` | the one accent: focus rings, row arrows on hover, focus-tile icons, selection, 404 button, one dot in covers | 6.34:1 on ink, 5.84:1 on graphite |

Derived, one job each:
- `--dim` `#6f6961` is the second line of display headings only: 3.48:1 on ink, passing AA for large text (headings are ≥36px bold).
- `--card-muted` `#5f584f` is muted text on the bone card: 6.12:1.
- Dark text on rose, as on the 404 button: 6.34:1.

Rationale: warm near-black and bone instead of pure black and white is softer on the eyes and feels like paper and ink. The rose accent comes from your existing logo (`#FF004F`), refined so it doesn't vibrate on dark. It appears only where something is interactive or worth noticing. It never fills a large area, except on the 404 page's single button.

### Typography

- **Display: Bricolage Grotesque** (variable `opsz 12–96`, `wght 200–800`, OFL). Headings use `opsz 96` / 700 with `-0.022em` tracking. It has character without being a novelty face, and it is far from Poppins, Inter, Space Grotesk and Playfair.
- **Body: Geist** (variable `wght 100–900`, OFL). A neutral, highly legible grotesk with good figures; tabular numbers are used for dates.
- Fluid scale via `clamp()` (360→1440px): small 13–14px, body 16–17px/1.6, lead 17–20px, title 20–24px, stat 36–56px, h2 36–60px, display 44–84px. Prose max-width is 36–40rem, about 70 characters.
- Both families are preloaded, with `font-display: swap` and metric-adjusted Arial fallbacks (`size-adjust`, ascent/descent overrides). Measured CLS is 0.

### Self-critique (one pass) and what changed

1. Display tracking was −0.035em, and the letters in "engineer" touched at 84px. **Loosened to −0.022em.**
2. The first accent candidate, a straight logo pink, vibrated on near-black. **Moved to `#ff5c7a`.**
3. Rose risked appearing on every link. **Links stay bone or stone with a wipe underline; rose is kept for focus and hover.**
4. The reference's dim heading line is decoration-only contrast (~1.4:1). **Mine is 3.48:1.**
5. Tool tiles with brand logos would read like a badge cloud and raise trademark questions. **Replaced with typographic two-letter marks in a periodic-table rhythm, each paired with where the tool was actually used.**
6. Generic tells checked and avoided: no tracked all-caps eyebrows, no 01/02/03 numbering, no accent word in every headline, arrows only on project rows, no middle-dot meta strings on the site (the OG image has one).

---

## 5. Motion

- **Load:** the dock, card, heading lines (mask-reveal, 1100ms), lead, stats and focus tiles stagger in at 90–110ms with `cubic-bezier(.22,1,.36,1)`. It waits up to 600ms for fonts so lines reveal once.
- **Scroll:** `[data-reveal]` elements fade and rise 28px once via IntersectionObserver; list siblings stagger.
- **Smooth scroll:** Lenis (`lerp .11`) on fine pointers only. Native on touch. Off for reduced motion.
- **Hover:** row surface fades in, the thumbnail scales to 1.05 over 900ms, and the arrow nudges and turns rose. Links get an underline wipe. Tool marks tilt 4°.
- **Cursor:** a small "View" label follows the pointer over home project rows. Fine pointers only, and the native cursor is never hidden.
- **Page transitions:** cross-document View Transitions (`@view-transition`): a quick fade and slide in Chromium; other browsers just navigate.
- **Safety:** all hidden states sit under `.js`, which is set inline. If `main.js` fails, a 2.5s fallback removes `.js` so nothing stays hidden. `prefers-reduced-motion` disables all transforms and transitions.
- Only `opacity` and `transform` are animated.

---

## 6. Content inventory and source map

Sources:
**[CV]** `assets/docs/mona-agrawal-resume.pdf` (LaTeX, generated 13 Mar 2026).
**[GH]** GitHub API for user `Mona-Agrawall` and repos.
**[RM:repo]** a repo's README.
**[OLD]** the previous site (`legacy/index.html`).
**[CERT]** certificate files in `assets/docs/`.
**[GHP]** the GitHub profile README.

| Fact on the site | Source |
|---|---|
| Name "Mona Agrawal" (full name on CV: Mona Mahendra Kumar Agrawal) | CV, GH, OLD |
| Email mona.mk.agrawal@gmail.com | CV, OLD, GHP |
| GitHub `Mona-Agrawall`, LinkedIn `/in/mona-agrawal-/`, X `Mona_Agrawall`, Instagram `mona_agrawall` | CV (GitHub, LinkedIn), OLD (all four), GHP (LinkedIn, Instagram) |
| Location Chennai, Tamil Nadu | GH (`location`), CV |
| "AI engineer and full-stack developer" | OLD hero ("AI Engineer \| LLM Applications \| RAG Systems"), GH bio ("Full-stack developer working on web and AI projects") |
| B.Tech CSE, SRMIST, Aug 2023 – May 2027, Chennai | CV, OLD (2023–2027) |
| St. Xavier's Senior Secondary School, Balrampur UP, Apr 2019 – Jul 2022 | CV, OLD |
| Placfv's SRM: R&D Member, Jan 2025 – Present, EDA on 50+ datasets, Pandas + SQL, +35% placement engagement | CV |
| Coding Ninjas SRM: Corporate Member, Sept 2024 – Present, hackathons on Devfolio for 300+ | CV, OLD ("Coding Ninja Club – Corporate Member, 2024–Current") |
| Blockchain Club (Creatives), dBug Labs (Event Member), Movies and Dramatic Club (Actor), 2024 – Present; Aaruush (Creatives) 2023–2024 | OLD |
| Smart India Hackathon, SRM internal round, Sept 2025, top teams of 800+ | CV, CERT (internal edition, 15–17 Sept 2025) |
| Adobe India Hackathon, Jul 2025, top 2% of 260,000+, Team BrainRot | CV (rank, date), CERT (team name, participation) |
| Agnirva AI Internship Program, Fast Track, completed 10 Apr 2025, 100+ hours | CERT, OLD |
| CAD 2.0, 36-hour hackathon by Coding Ninjas SRM at SRMIST Kattankulathur | CERT (`cad-2-hackathon-certificate.jpg`, originally `images/Hachathon.png`) |
| SOEL Model UN 2024, delegate of Myanmar, DISEC | CERT (`legacy/images/MUN.png`, 1–3 Mar 2024) |
| Doodling and singing | OLD |
| Skills lists | CV, OLD; TypeScript from GH repo languages (Nazar, MailFlow) |
| C++ for DSA | CV (C++ listed first), GHP ("Currently strengthening Data Structures & Algorithms") |
| Video translation: Whisper, FFmpeg, Streamlit, gTTS; 14% WER, 0.65 BLEU, 1-min video in ~45s on CPU, <150ms A/V deviation | CV, RM:multilingual-video-translation-system |
| Nazar: Code by Groww 2026 submission; attention score 0–100; per-user snapshots; Gemini narrative with deterministic fallback; Supabase RLS; React 19/TS/Vite/Tailwind/Express; live link | RM:nazar, GH (homepage) |
| Chemical Safety RAG: LangChain, FAISS, MiniLM, Mistral via Ollama, Streamlit, offline, page-level citations, conversation memory | CV, RM:chemical-safety-rag-assistant |
| MailFlow: ReachInbox/Outbox Labs assignment; Express/TS, PostgreSQL, Redis, BullMQ, Elasticsearch, React/Tailwind; no cron; reconcile watchdog; Slack alert deduplicated per hour | RM:mailflow-email-scheduler, GH description |
| Adaptive Diagnostic Engine: GRE, IRT-inspired, FastAPI, MongoDB Atlas, Groq LLaMA 3.3 70B, 3-step study plan | CV, RM:adaptive-diagnostic-engine |
| Self-Pruning NN: sigmoid gates, L1-style penalty, CIFAR-10, four λ values, 78.60% sparsity at 61.78% accuracy (λ=1.0), 61.01–61.78% accuracy across 46.68–78.60% sparsity | RM:self-pruning-neural-network, `requirements.txt` (torch, torchvision, numpy, matplotlib) |
| Deadline OS: Chrome MV3, Gmail API polling every 30 min, rule-based parser, confidence score, date formats, Calendar sync, 1h/15m reminders | RM:deadline-os |
| Canonical URL https://monaaportfolio.netlify.app/ | CV link, GH `blog`, README |

Images:
- Nazar, MailFlow and Chemical RAG screenshots are your own README screenshots (GitHub user-attachments), cropped and converted to WebP.
- The video translation, adaptive engine, self-pruning and Deadline OS covers are **original SVG illustrations** I drew. They are not screenshots, and their alt text says so.
- The old `work-1/2/3.png` were stock phone photos unrelated to the projects, so they were dropped.
- `user.png` (a stock person) was unused and dropped.

---

## 7. Data conflicts and decisions

| Conflict | Choice |
|---|---|
| Adaptive engine LLM: CV says "Groq API (LLaMA-3)"; README says "Groq LLaMA 3.3 70B" | README (more specific, same model family) |
| School dates: OLD splits them (High School 2019–20, Senior Secondary 2021–22); CV merges them (Apr 2019 – Jul 2022) | CV |
| OLD said "third-year student". As of Oct 2026, Aug 2023 – May 2027 makes you final-year. | Year-of-study wording removed; "graduating in 2027" used instead |
| OLD said "specializing in Artificial Intelligence and Machine Learning"; CV says B.Tech in Computer Science and Engineering with no specialisation | Official degree name only; AI/ML is described as focus, not specialisation |
| GH bio "Full-stack developer…" vs OLD "AI Engineer" | Combined: "AI engineer and full-stack developer" |
| CAD 2.0 certificate spells the name "Agarwal"; every other source says "Agrawal" | "Agrawal" used; the certificate is linked as-is |
| Project screenshot for video translation: README image links return 404 | Original SVG cover used instead |
| Video translation homepage `multilingual-video-translation-syst.vercel.app` returns 404 | Not linked |
| "Aaruush" (OLD writes "AARUUSH") | Sentence case for consistency with other entries |
| "Movies and Dramatic Club" | Kept exactly as on OLD |

---

## 8. Things you need to confirm or provide

1. **Neeyat AI (AI Engineering Intern).** Not found in the CV, GitHub, the old site, or web search, and LinkedIn is login-walled. **Left off the site.** If it's real and current, add it as the first entry under Experience on `index.html` and `about.html`, with dates and one or two lines of what you did.
2. **IEEE paper on multilingual video dubbing.** No source names it. The closest search hit was an SRMIST Ramapuram paper on Whisper/VITS dubbing with different authors. **Left off.** If you have one, send the exact title, venue, status (submitted / accepted / published) and a DOI or link, and I'd add a Publications block to About.
3. **"Placfv's SRM".** Copied exactly from the CV, but I couldn't find the organisation online. Please check the spelling (it reads like a typo).
4. **"– Present" dates** (Placfv's, Coding Ninjas, and the clubs) come from a March 2026 CV and the old site. Confirm they're still current in Oct 2026.
5. **Adobe India Hackathon "Top 2%".** The CV claims it, but the certificate only confirms Round 1 participation. Keep it only if you can back it up.
6. **CAD 2.0 year.** The certificate gives "14th–17th March" without a year, so the site shows "Participant" in place of a date.
7. **GPA 9.36 and school percentages.** Only in the CV, not consistent across sources, so not shown, per your rule.
8. **Phone number.** It was on the old site and is in the CV, but it's left off the web pages to cut spam. It's still in the downloadable résumé.
9. **Contact form.** The old form had no backend and silently did nothing. It's replaced by a mailto link plus copy-to-clipboard. If you want a form, Netlify Forms needs only `data-netlify="true"` on a `<form>`, but that is a hosting feature I didn't enable.
10. **LeetCode / Codeforces.** No profile links in any source, so none added. Send the URLs and they slot into the card and contact list.
11. **Portrait.** The source is 433×576, fine at card size but soft on large retina screens. A 900×1200 original would be sharper (`assets/img/mona-portrait.webp`).
12. **README license.** `README.md` (from before this branch) links to a `LICENSE` file that doesn't exist. Add one, or remove the line; choosing a license for your code is your call. Third-party licenses are included: `assets/fonts/OFL-*.txt` and `vendor/LICENSE-lenis.txt`.
13. **Light theme.** Skipped on purpose; dark plus the bone card is the considered design. Doing light to the same standard is a separate pass.

---

## 9. Verification results (local, 10 Oct 2026)

Served with `python -m http.server`, which has no compression. Netlify adds Brotli/gzip, so production should be the same or better.

### Lighthouse 12.2.1 (headless Chromium 130)

| Page | Mode | Perf | A11y | Best Pr. | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| Home | mobile | 95 | 100 | 100 | 100 | 2.4s | 0 |
| Home | desktop | 100 | 100 | 100 | 100 | 0.5s | 0 |
| Projects | mobile | 98 | 100 | 100 | 100 | 2.3s | 0 |
| Projects | desktop | 100 | 100 | 100 | 100 | 0.5s | 0 |
| About | mobile | 99 | 100 | 100 | 100 | 2.1s | 0 |
| About | desktop | 100 | 100 | 100 | 100 | 0.4s | 0 |
| Toolkit | mobile | 99 | 100 | 100 | 100 | 2.0s | 0 |
| Toolkit | desktop | 100 | 100 | 100 | 100 | 0.4s | 0 |

### Browsers and widths (Playwright 1.48.2)

For every page at every width, the script scrolled the full page and checked horizontal overflow, console errors and warnings, failed requests, and that every reveal fired.

| Engine | Widths | Result |
|---|---|---|
| Chromium | 360, 390, 768, 1024, 1440, 1920, 2560 | Pass: no overflow, no errors |
| Firefox | 390, 768, 1024, 1440, 1920 | Pass |
| WebKit | 390, 768, 1024, 1440, 1920 | Layout pass, no errors. **Caveat:** Playwright's *Windows* WebKit build doesn't apply variable-font weights (all weights measure identically, even with explicit `font-variation-settings`), so text renders light there. Safari on macOS/iOS has supported variable WOFF2 since Safari 11. **Please glance at the site on an iPhone or Mac** to confirm. |

### Other checks
- **JavaScript disabled:** all content visible on all pages, navigation works.
- **`prefers-reduced-motion: reduce`:** nothing hidden or animated.
- **Headings:** one `h1` per page, no skipped levels. All images have `alt` (decorative thumbnails use `alt=""` because the adjacent title carries the meaning).
- **Keyboard:** skip link → dock → résumé/email → socials → project rows (focus ring on the whole row) → page links, with focused elements scrolled into view under Lenis.
- **Links:** all internal paths, anchors and icon IDs resolve. External: GitHub (8), Nazar live, X and Instagram return 200. LinkedIn returns 999 (bot-blocking; the URL comes from your CV). `monaaportfolio.netlify.app/*.html` returns 404 until you deploy.
- **SEO:** unique title and description per page, canonical, OG + Twitter cards with a 1200×630 `og.png`, SVG + PNG favicons, apple-touch icon, `theme-color`, Person JSON-LD on home (verified fields only). `sitemap.xml` and `robots.txt` didn't exist before, so none were created, per instructions.

---

## 10. Design critique passes

- **Pass 1:**
  - Tightened display tracking.
  - Fixed focus-tile titles, which were losing a specificity fight and rendering at body size.
  - Widened the mobile stat column so `<150ms` doesn't crowd its label.
  - Made mobile focus tiles compact so the first project row lands within one scroll.
- **Pass 2:**
  - Removed an accessory: tool tiles no longer tilt on hover. They aren't links, so the motion promised an interaction that doesn't exist.
  - Text links now have a quiet resting underline in `--hairline`, so they're discoverable before hover; the full-colour wipe still plays on hover.
  - 404 headline changed from "Nothing here yet" to "This page doesn't exist", which is more honest.
