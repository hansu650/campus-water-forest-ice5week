# Campus Reef

An ICE Week 5 campus sustainability prototype: care for a fish, explore sample water records and preview campus tree guardianship.

**[Play Campus Reef](https://hansu650.github.io/campus-water-forest-ice5week/)**

This is an evolving class project. It supports desktop and mobile browsers without registration. New saves start in English; the language control also provides Chinese for local testing, and existing saves retain their selected language.

## Features

- Choose from six fish, personalise their size and outfit, and feed them to earn growth points.
- Share the scene with four labelled demo companions, or hide them in Together. These are local game characters.
- Watch your fish grow with its level. At level 3, welcome one baby fish that keeps its own species and follows its parent.
- Complete a campus photo puzzle and a pipe-connection challenge. Each first clear awards food and a badge.
- Explore clearly labelled sample water records and collect a one-time sample green-points reward.
- Preview your name and locally saved guardian names on a virtual campus tree plaque.
- Reveal the care controls and task bar by hovering near the top or bottom. Tap the handles on touchscreens, use Tab on a keyboard, or pin both toolbars with the top-right tank button.

Progress is stored in the current browser using `localStorage`. Different devices and browsers have separate saves. The online site and a local HTML file also have separate saves. Clearing site data can remove progress; private browsing is not suitable for a lasting save.

## Run locally

Use Node.js 22 or later. Deployment uses Node.js 24. There are no npm dependencies, so no installation step is needed.

```sh
npm test
npm run build
npm start
```

Open `http://127.0.0.1:57863/`, or open the generated `dist/index.html` directly. Images, fonts and code are embedded in the built HTML file.

## Source structure

| Path | Purpose |
| --- | --- |
| `src/index.template.html` | Page structure and accessible controls |
| `src/style.css` | Interface styles and responsive layout |
| `src/core.js` | Game rules, rewards and saved-state validation |
| `src/app.js` | English and Chinese interface text, interactions, sound and animation |
| `src/pond-life.js` | Six-species catalog, demo companions and baby-fish movement |
| `src/edge-controls.js` | Hover, touch and keyboard access to retractable toolbars |
| `src/scenery.js` | Original canvas plants, driftwood, stones and sand |
| `assets/` | Image mapping, game images, fonts and font licences |
| `scripts/` | Dependency-free build and local preview |
| `tests/core.test.cjs` | Twenty-three game-rule and regression checks |
| `tests/browser.test.cjs` | Fifteen real-browser scenarios, including growth, reloads and touch controls |
| `.github/workflows/pages.yml` | Automated checks, build and GitHub Pages deployment |

For the test coverage, direct commands and optional existing Playwright runtime, see [Testing Campus Reef](docs/testing.md). Rule tests use only Node built-ins; the browser suite does not install packages.

A push to `main` runs the rule checks, builds the game and deploys it. Pull requests run checks and build without deployment. Generated `dist/` files are not committed; Pages publishes the built site only.

## Scope and evidence

Water durations, fees and green points are demonstration data. The game is not connected to Quzhi Campus or a server database. Durations and fees do not directly measure litres saved. Tree plaques are composite previews, not evidence of physical installation, formal adoption or school approval. Guardian names are stored locally; co-care does not synchronise across devices.

The public version includes approved campus scenery assets. Classroom portraits, original course materials, private bills and individual reflections remain outside this repository. Three fish species use photo-derived assets with AI-assisted background removal, poses or outfits; three more use original vector illustrations created with coding assistance. See [asset sources and licences](ASSET_CREDITS.md).

The interface takes layout inspiration from Reefy. The interface and water scene were independently implemented; no Reefy code or game assets were copied.

## Team and contributions

Qin Tian (Team Leader), Tao Jiacheng, Wang Yikai, Song Peitong and Jiang Yuchen.

See [the contribution guide](CONTRIBUTING.md) for responsibilities, English submission requirements and the branch/PR workflow. The role allocation describes responsibilities, not completed contributions.

The repository records the current version and subsequent real work. Earlier iterations took place locally; no historical commits have been reconstructed. Code and some visual assets were made with AI assistance. Automated rule checks and developer interface checks are not independent user studies or evidence of actual water savings.

This repository is public for course presentation and review. No additional licence is granted for the project as a whole; third-party asset licences continue to apply.
