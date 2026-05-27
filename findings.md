# Findings

## 2026-05-28 Maintenance Audit

### Repository
- The site is still a plain static GitHub Pages site using `index.html` and `styles.css`.
- No package manager or build step is present, which is appropriate for this portfolio.
- `.nojekyll` is present, so Pages should publish the source as a static site without Jekyll processing.

### Initial Content Review
- Visible homepage text is in English and generally matches Yi Han's current background.
- Project links point to GitHub README pages for real repositories.
- The page has no JavaScript, which keeps it fast and reliable.

### UI/UX Review Inputs
- Design guidance for a developer portfolio favors neutral colors, clear project presentation, and strong accessibility basics.
- For this site, restraint is more important than animation-heavy portfolio patterns.
- Responsive risks to test: mobile navigation wrapping, horizontal scrolling, fixed sidebar behavior, and focus order.

### Initial Issues To Verify
- No explicit `robots.txt` or `sitemap.xml` existed before this audit.
- Need to verify mobile layout at narrow widths.
- Need to verify all project and contact links.
- Need to check live GitHub Pages deployment after changes.

### Verified Issues
- On a narrow mobile viewport, the sticky navigation becomes two rows and is taller than the existing anchor scroll offset. This can cause section headings to land partly under the header after tapping navigation links.
- The browser initially reused a cached copy of `styles.css`, so the mobile anchor-offset fix did not apply until the stylesheet URL changed. Versioning the stylesheet URL makes the deployed fix reliable for returning visitors.
- External links that open in a new tab use `noreferrer`; adding `noopener` explicitly makes the security intent clearer.
- GitHub and asset links return HTTP 200 with a browser-like GET request. LinkedIn returned HTTP 999 to automated checking, which is a common bot-blocking response rather than proof that the link is broken.
- `robots.txt` and `sitemap.xml` were added and both return HTTP 200 in the local preview.
