# VECTOR — Merged Interactive Learning Platform

This repository is the **merged GitHub Pages version** of the VECTOR project for **Unit 5: VECTOR** (DUM10092 Engineering Mathematics). It preserves the deployable `vector-learning-platform` site while retaining the key source materials from [`FarahDina19/VECTOR`](https://github.com/FarahDina19/VECTOR).

The deployed app covers:

- **5.1** Introduction to Vector (scalar vs vector, types of vectors, notation, scalar multiplication)
- **5.2** Vector in Cartesian Planes (component form, drawing vectors, magnitude & direction)
- **5.3** Addition & Subtraction of Vectors (triangle law, parallelogram law, algebraic addition/subtraction)

## 🚀 Live Demo

- GitHub Pages: https://farahdina19.github.io/vector-learning-platform/
- Local entry point: [`index.html`](index.html) → redirects to [`VECTOR-LANDING-PAGE.html`](VECTOR-LANDING-PAGE.html)

## ✨ What the merged repository contains

- The **target repository's deployable entry point** for GitHub Pages (`index.html`)
- The **main VECTOR learning app** (`VECTOR-LANDING-PAGE.html`)
- The **modular target-only enhancements** that expand the original source app:
  - `vector-math.js` for offline MathML rendering
  - `vector-diagrams.js` for reusable SVG vector diagrams
  - `vector-labs.js` + `vector-labs.css` for interactive labs and workbook-style practice
- The original VECTOR production specification:
  - [`DETAILED_VECTOR_PROMPT_PRODUCTION.md`](DETAILED_VECTOR_PROMPT_PRODUCTION.md)
  - [`DETAILED_VECTOR_PROMPT_PRODUCTION.md.pdf`](DETAILED_VECTOR_PROMPT_PRODUCTION.md.pdf)

## ✨ Features

- Six tabs: Intro, Scalar & Vector, Component Form, Addition, **Practice**, and Resources
- Interactive labs that visualize journeys, components, operations, and scalar multiplication
- A full **Practice** engine with:
  - Generated questions across Easy / Medium / Hard difficulty
  - Workbook-style exercises reconstructed from the source learning materials
  - Live SVG Cartesian-plane diagrams, color-coded by convention (blue = i, red = j, green = resultant)
  - Real-time answer validation, progressive hints, and step-by-step solutions
  - XP, levels, and progress tracking stored locally in the browser
- No build step and no external runtime dependencies

## 📁 Key files

| File | Description |
|---|---|
| `index.html` | GitHub Pages entry point. Keeps the site working under the `/vector-learning-platform/` project path by redirecting to the app with a relative URL. |
| `VECTOR-LANDING-PAGE.html` | Main merged VECTOR learning experience. |
| `vector-math.js` | Offline MathML formatting helpers used by the app. |
| `vector-diagrams.js` | Reusable SVG diagram builder for vector questions. |
| `vector-labs.js` | Interactive learning labs and workbook question wiring. |
| `vector-labs.css` | Styles for the labs/workbook extensions. |
| `DETAILED_VECTOR_PROMPT_PRODUCTION.md` | Source project specification retained in the merged repo. |
| `DETAILED_VECTOR_PROMPT_PRODUCTION.md.pdf` | PDF version of the same source specification. |

## 🛠️ Run locally

No installation is required.

1. Clone or download this repository.
2. Open [`index.html`](index.html) or [`VECTOR-LANDING-PAGE.html`](VECTOR-LANDING-PAGE.html) in a modern browser.
3. For the closest match to GitHub Pages behavior, serve the folder statically (for example with `python -m http.server`) and open `index.html`.

## 🌐 Deploy to GitHub Pages

This repository is intended to be published as a **project site**:

- Repository: `FarahDina19/vector-learning-platform`
- Expected Pages URL: `https://farahdina19.github.io/vector-learning-platform/`

To keep deployment working:

- Keep `index.html` at the repository root
- Keep app assets in the same root folder so relative links remain valid
- Avoid changing links to root-absolute paths such as `/...`, which would break under the project-site subpath

## 🔎 Notes on the merge

- The source repository `FarahDina19/VECTOR` mainly provided the original single-file app and production prompt.
- The target repository already contained expanded learning features and deployable structure, so the merged result preserves those working target features while keeping the source specification artifacts available in this repository.

## Added screenshot-based lessons

- **5.3 / Addition:** step through DB, AC and CD using the ABCD diagram. AC and BD intersect at a calculated E; E is not assumed to be a midpoint. The given x and y are oblique basis vectors, not Cartesian axes.
- **5.2 / Component Form:** change k in ka − b; inspect the resultant, magnitude and normalized vector on a separate unit-circle diagram. The original example starts at k = 4.
- **Practice:** two new sets, each with 6 questions (original question parts plus variations), hints, solutions and existing XP/progress support. Unit-vector answers use four decimal places; magnitudes use two.
- `vector-extensions.js` contains these lessons and exercises. `vector-visuals.js` contains vector anatomy and five vector-type diagrams.

### Browser checks

From the repository root, with Playwright available (or `PLAYWRIGHT_MODULE` set to its absolute module path):

```text
node tests/diagram-audit.cjs
node tests/lesson-audit.cjs
node tests/workbook-audit.cjs
```

The checks use installed Microsoft Edge in headless mode. Screenshots go to ignored `tmp/`. The diagram audit samples 2,250 existing generated questions, verifies mathematical answers, arrow endpoints, arrowheads and equal axis scales. The other checks cover new geometry, all 12 new questions, slider states, the 14 workbook questions and mobile overflow. Random sampling does not exhaust every possible generated question.
