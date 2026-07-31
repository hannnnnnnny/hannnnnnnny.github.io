# Yi Han Portfolio Hub

This repository contains the source for my GitHub Pages portfolio hub:

https://hannnnnnnny.github.io

The hub links to two independent role-specific portfolio websites:

- Software Engineering: https://hannnnnnnny.github.io/yi-han-software-engineer/
- Data Analytics: https://hannnnnnnny.github.io/yi-han-data-analytics/

The hub is intentionally short. It uses plain HTML and CSS only, with no JavaScript or build step.

## Structure

- `index.html` contains the hub content.
- `styles.css` contains the hub layout and visual styling.
- `assets/` contains resume/CV PDFs, the favicon, and the social preview image.
- `robots.txt` and `sitemap.xml` provide basic crawler metadata.
- `.nojekyll` keeps GitHub Pages from running Jekyll on this static site.
- `task_plan.md`, `findings.md`, and `progress.md` record maintenance notes.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

```bash
npx http-server .
```

No build step is required.

## Maintenance Notes

- Keep visible website text in English.
- Keep the hub focused on routing visitors to the correct role-specific website.
- Avoid adding heavy dependencies unless the site actually needs them.
- Run a local preview and check responsive layouts before publishing larger visual changes.
