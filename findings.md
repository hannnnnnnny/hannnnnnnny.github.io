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

## 2026-05-30 Data and AI Portfolio Refresh

### Reference Research
- Chosen public reference: Lilian Weng's `Lil'Log`.
- GitHub repository: `https://github.com/lilianweng/lilianweng.github.io`.
- Live site: `https://lilianweng.github.io/`.
- Why it fits: the site is famous in the AI community, uses a public GitHub Pages source, and presents expertise through clear technical writing rather than flashy portfolio effects.
- Useful design principles: short personal intro, simple navigation, readable article list, dates and reading context, and visible links to technical profiles.
- Decision: do not copy the design, text, colors, or assets; adapt the underlying content strategy for Yi Han's data/AI job-search context.

### Current GitHub Project Audit
- `pansub`: Chrome extension for AI-assisted subtitle support on Panopto lecture recordings. Strongest AI/product signal.
- `video-game-sales-ml-analysis`: Reusable data and machine learning analysis workflow. Strongest data analytics signal.
- `ReNova-Second-Hand-C2C-Marketplace`: Full-stack C2C marketplace with Spring Boot, Vue, MySQL, offers, messaging, escrow-style order flow, and reviews.
- `study-room-booking-system`: Campus-style booking system with Vue, live availability, and a visual workstation map.
- `teacher-management-system`: Full-stack admin dashboard with reporting, analytics, and resource status views.

### Redesign Direction
- Position Yi Han as an Auckland-based Master of IT student focused on data analysis, AI tools, and practical software systems.
- Lead with evidence: real GitHub projects, README links, practical user problems, and learning notes.
- Keep the page calm and credible for New Zealand graduate or internship applications.
- Include AIDLC as a studied AI project lifecycle concept without overstating it as professional experience.

## 2026-05-30 Dark Theme Refresh

### Reference Research
- Chosen public reference: Brittany Chiang's portfolio and `bchiang7/v4` GitHub repository.
- Why it fits: the repository is highly starred and forked, and the live portfolio is known for a dark developer-focused aesthetic.
- Useful principles: dark background, readable muted text, accent color for links and labels, sticky side navigation, and project cards that show credible technical work.
- Decision: avoid copying the exact color tokens, text, layout details, animation style, or assets. Use the reference only to guide a dark professional mood.

## 2026-05-30 Vue Interaction Upgrade

### User Request
- The user wants JavaScript and Vue framework effects so the portfolio does not feel static.

### Implementation Findings
- The repository is still best served as a static GitHub Pages site. A full Vite migration would add unnecessary build and deployment complexity for this homepage.
- Vue's CDN/global-build pattern fits this repository because it can enhance the existing HTML without a build step.
- Strongest portfolio-specific interactions are project filtering, AIDLC learning tabs, scroll-aware navigation, and a small KNN sketch tied to Yi Han's data and AI direction.
- Vue should not own the whole static page in this repository. Using a hidden Vue controller keeps the page readable even if JavaScript fails, while still enabling the requested effects.
