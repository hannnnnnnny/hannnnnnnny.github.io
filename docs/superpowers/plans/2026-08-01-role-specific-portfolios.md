# Role-Specific Portfolios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split Yi Han's portfolio presentation into a focused Data Analyst main site and an independent Software Engineer site while preserving the existing interactive polish.

**Architecture:** Keep the main `hannnnnnnny.github.io` repository as the Data Analyst portfolio and update `yi-han-software-engineer` as the independent software engineering portfolio. Both sites remain static GitHub Pages sites using semantic HTML, CSS, and vanilla JavaScript for progressive interactions.

**Tech Stack:** HTML, CSS, vanilla JavaScript, GitHub Pages, GitHub CLI, Chrome/Playwright browser verification.

## Global Constraints

- All visible website text, README text, code comments, and commit messages must be in English.
- Preserve existing useful interactions: command palette, project filters, hover effects, scroll progress, canvas visualizations, skill-map interactions, and keyboard/focus states.
- Remove only the scrolling marquee/banner effect.
- Data Analyst site projects: TillTally, Video Game Sales ML Analysis, PanSub.
- Software Engineer site projects: ReNova Second-Hand C2C Marketplace, KiwiCue, TillTally.
- Data Analyst skills should emphasize data, ML, AI workflow, data-product tooling, and shared delivery tools.
- Software Engineer skills should emphasize frontend, backend, databases, engineering delivery, and shared tools.
- Keep each site credible for New Zealand graduate/junior job applications.

---

### Task 1: Main Data Analyst Site

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing static site sections and JavaScript hooks.
- Produces: a Data Analyst portfolio at `https://hannnnnnnny.github.io/`.

- [x] Update the hero title to `Data Analyst | Yi Han`.
- [x] Rewrite hero, profile, projects, skills, contact, and metadata copy for data/AI roles.
- [x] Remove the marquee HTML, marquee CSS, and marquee JavaScript.
- [x] Reduce visible project cards to TillTally, Video Game Sales ML Analysis, and PanSub.
- [x] Keep project filters, command palette, KNN canvas, AIDLC tabs, scroll/hover effects, and skill-map interactions.
- [x] Split skill icons into data-focused groups with shared stack items retained.
- [x] Run static text/path/link checks and a browser smoke test.
- [x] Commit with `feat: focus main portfolio on data analyst roles`.

### Task 2: Independent Software Engineer Site

**Files:**
- Modify: `yi-han-software-engineer/index.html`
- Modify: `yi-han-software-engineer/styles.css`
- Create: `yi-han-software-engineer/app.js`
- Create/modify: `yi-han-software-engineer/assets/previews/*`
- Modify: `yi-han-software-engineer/README.md`

**Interfaces:**
- Consumes: the existing independent GitHub Pages software portfolio repository.
- Produces: a Software Engineer portfolio at `https://hannnnnnnny.github.io/yi-han-software-engineer/`.

- [x] Reuse the current portfolio interaction system so the software site keeps the same quality bar.
- [x] Update the hero title to `Software Engineer | Yi Han`.
- [x] Feature ReNova, KiwiCue, and TillTally as the three software projects.
- [x] Replace Study Room Booking with TillTally.
- [x] Split skill icons into software-focused groups with shared stack items retained.
- [x] Keep command palette, project filters, hover effects, scroll progress, canvas/skill visualizations, and keyboard/focus states.
- [x] Remove any marquee/banner code.
- [x] Run static text/path/link checks and a browser smoke test.
- [x] Commit with `feat: upgrade software engineering portfolio`.

### Task 3: Publish and Verify

**Files:**
- No new source files beyond Tasks 1 and 2.

**Interfaces:**
- Consumes: pushed `main` branches for both repositories.
- Produces: two live GitHub Pages URLs verified after deployment.

- [x] Push both repositories to GitHub.
- [x] Confirm GitHub Pages builds are complete.
- [x] Check the live URLs for 200 responses, no broken local asset links, no old marquee text, and expected role-specific titles.
- [x] Report commit hashes, commands run, URLs, and remaining notes.
