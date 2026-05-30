# Yi Han Personal Website

This repository contains the source for my personal GitHub Pages website:

https://hannnnnnnny.github.io

The site is intentionally simple. It uses plain HTML, CSS, and a small Vue 3 enhancement layer so it is easy to read, edit, and publish through GitHub Pages. The current homepage uses a dark technical theme and emphasizes IT, data analytics, AI tools, AIDLC learning, and practical software projects.

## Structure

- `index.html` contains the page content.
- `styles.css` contains the layout and visual styling.
- `app.js` contains the Vue-powered interactions, project filters, scroll state, and KNN sketch.
- `assets/` contains resume/CV PDFs, the favicon, and the social preview image.
- `robots.txt` and `sitemap.xml` provide basic crawler metadata.
- `.nojekyll` keeps GitHub Pages from running Jekyll on this static site.
- `task_plan.md`, `findings.md`, and `progress.md` record maintenance notes.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

```bash
npx http-server .
```

No build step is required. Vue is loaded from the official CDN pattern for static HTML pages.

## Maintenance Notes

- Keep visible website text in English.
- Keep project links pointed at real GitHub repositories.
- Keep JavaScript progressive: the core content should still be readable if scripts do not load.
- Avoid adding heavy dependencies unless the site actually needs them.
- Run a local preview and check responsive layouts before publishing larger visual changes.
