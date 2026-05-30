# Progress

## 2026-05-28

- Started maintenance audit requested by the user.
- Confirmed the working tree was clean before edits.
- Read `task_plan.md`, `index.html`, `styles.css`, and `README.md`.
- Read relevant planning and frontend/UI guidance.
- Ran UI/UX guidance search with the bundled Python runtime after system `python` was unavailable.
- Added this session's audit phases to `task_plan.md`.
- Created `findings.md` and `progress.md` for this maintenance pass.
- Started a local static server on port 4173 and confirmed the homepage returns HTTP 200.
- Verified desktop layout in the browser: no horizontal overflow, one `h1`, labelled sections, and no console errors.
- Verified responsive layout metrics at mobile, tablet, and desktop widths.
- Fixed the mobile anchor offset for the taller two-row mobile navigation.
- Versioned the stylesheet link so browsers fetch the updated CSS after deployment.
- Added explicit `noopener noreferrer` to external new-tab links.
- Added `robots.txt` and `sitemap.xml` for basic crawler metadata.
- Re-ran local asset checks: homepage, CSS, resume/CV PDFs, favicon, social preview, robots, and sitemap all returned HTTP 200.
- Re-ran GitHub project README link checks with browser-like GET requests; all GitHub links returned HTTP 200.
- Verified local browser DOM: all internal anchors resolve, no duplicate IDs, one `h1`, and all new-tab links include `noopener noreferrer`.
- Verified fresh mobile CSS: stylesheet version query is present, mobile scroll margin computes to 112px, and the project heading clears the sticky header.
- Browser screenshot capture timed out through the in-app browser after multiple approaches; layout verification continued with DOM metrics and viewport checks instead.
- Final pre-commit checks passed; preparing to commit and push the maintenance fixes.

## 2026-05-30

- Started data and AI portfolio refresh.
- Used `planning-with-files`, `frontend-design`, and `ui-ux-pro-max` guidance.
- Researched public AI personal sites and selected Lilian Weng's `Lil'Log` as the reference for a writing-first, credible technical homepage.
- Audited current public GitHub repositories and identified the strongest projects for IT, data analytics, and AI positioning.
- Added phases 9 to 11 to `task_plan.md`.
- Added AIDLC to the AI positioning after the user clarified they have studied it.
- Rewrote the homepage around a writing-first data/AI portfolio structure inspired by Lilian Weng's public technical blog.
- Ran responsive browser checks at mobile, tablet, and desktop widths.
- Fixed the mobile/tablet header so sticky positioning has an explicit top offset and anchor jumps have enough scroll margin.
- Local static checks passed: no Chinese UI text, no local-only paths, no banned generic AI copy, and local assets returned HTTP 200.
- GitHub README links for the featured projects returned HTTP 200; LinkedIn returned its usual automated-check blocking response.

## 2026-05-30 Dark Theme

- Researched high-recognition dark developer portfolios and selected Brittany Chiang's portfolio repository as the reference.
- Recorded the dark theme direction in `task_plan.md` and `findings.md`.
- Converted the portfolio to a black/dark technical theme with pink and cyan accents, updated metadata, stylesheet cache version, README, and social preview.
- Browser checks confirmed the dark theme loads, external links are safe, internal anchors exist, mobile project anchors clear the sticky header, and there is no horizontal overflow.
- Final local resource checks and project README link checks passed before commit.

## 2026-05-30 Vue Interaction Upgrade

- Started Vue interaction upgrade after the user requested JavaScript and Vue framework effects.
- Chose Vue 3 CDN/global build to keep GitHub Pages publishing simple and avoid an unnecessary framework migration.
- Added a Vue app root, scroll progress bar, active sidebar state, project category filters, AIDLC tab panels, and an interactive KNN canvas sketch.
- Updated README, findings, and the task plan to document the new static-plus-Vue structure.
- Found and fixed a Vue mounting issue where the first approach cleared the page DOM. The final approach keeps the static HTML visible and uses Vue as a controller.
- Browser checks passed for project filtering, AIDLC tab switching, KNN slider output, active navigation, and mobile/tablet/desktop overflow.
- Staged and committed the Vue interaction upgrade as `feat: add vue portfolio interactions`.
