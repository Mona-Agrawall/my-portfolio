# Portfolio — Mona Agrawal

Personal portfolio website for Mona Agrawal, a Computer Science student specialising in AI engineering, LLM applications, RAG systems, and intelligent backend development.

**Live site:** *[(PORTFOLIO)](https://monaaportfolio.netlify.app/)*

---

## Overview

A multi-page portfolio (Home, Projects, About, Toolkit) presenting AI and full-stack projects, experience, education and recognition. Built with plain HTML, CSS and JavaScript: no framework and no build step.

---

## Tech Stack

- **Structure:** semantic HTML5, one stylesheet, one script
- **Type:** Bricolage Grotesque + Geist, self-hosted variable WOFF2
- **Motion:** CSS transitions, IntersectionObserver reveals, [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling (self-hosted), cross-document View Transitions
- **Icons:** SVG sprite (Simple Icons, CC0, for brand marks)

---

## Project Structure

```
├── index.html          Home
├── projects.html       All projects
├── about.html          About, experience, education, recognition
├── toolkit.html        Tools and where they are used
├── 404.html
├── css/style.css
├── js/main.js
├── vendor/lenis.min.js
├── assets/
│   ├── fonts/  img/  docs/
│   ├── icons/          Technology logos (Simple Icons, Devicon)
│   └── favicon.svg
└── legacy/             Previous version of the site
```

---

## Local Setup

```bash
git clone https://github.com/Mona-Agrawall/my-portfolio.git
cd my-portfolio
python -m http.server 5173   # then open http://localhost:5173
```

Any static file server works. Opening `index.html` directly also works, apart from the SVG icon sprite, which some browsers block on `file://`.

---

## Author

**Mona Agrawal**
Computer Science Student — AI / ML Developer

- GitHub: [Mona-Agrawall](https://github.com/Mona-Agrawall)
- LinkedIn: [mona-agrawal-](https://www.linkedin.com/in/mona-agrawal-)

---

## License

Released under the [MIT License](LICENSE).
