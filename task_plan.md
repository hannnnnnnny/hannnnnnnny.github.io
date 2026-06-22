# Portfolio Improvement Plan

## Initial Audit

### Stack and Repository
- Static GitHub Pages site using plain `index.html` and `styles.css`.
- No package manager, build step, lint script, or JavaScript runtime needed for the site.
- Current assets are limited to `assets/CV_YiHan.pdf`.
- The repository is easy to maintain, but lacks a formal improvement plan and has limited metadata.

### UI and UX Issues
- Sidebar navigation works, but it is visually plain and does not help visitors understand the page structure quickly.
- The homepage has good restraint, but the hero and project sections still feel a little flat.
- Project cards are readable but not strongly scannable; the most important project value, tech stack, and outcomes could be clearer.
- External project links point to README pages, which is useful, but the NovaCart repository name has changed and should be updated.
- There is no visible "experience" or education timeline section, so the current academic path is only in the hero/about text.

### Content Issues
- Copy is honest and clear, but some sentences are still generic and could sound more personal.
- Projects should reflect the current GitHub repositories:
  - `NovaCart-Fashion-Commerce-Platform`
  - `study-room-booking-system`
  - `teacher-management-system`
  - `video-game-sales-ml-analysis`
- The NovaCart description should reflect the current multi-merchant website-builder direction, not the older single-store description.
- Skills can be grouped more tightly around frontend, backend, database, data, and practice.
- Notes/blog section is useful, but needs a calmer empty-state framing.

### Code Quality Issues
- HTML is semantic overall, but several repeated card structures could be made easier to scan with consistent sub-elements.
- CSS is compact, but the design system can be improved with clearer section rhythm, link styles, card metadata, and responsive refinements.
- No unused JS is present.
- No dead image assets are present.

### SEO and Social Preview Issues Found
- Basic title and description exist.
- Missing canonical URL.
- Missing Open Graph and Twitter Card metadata.
- Missing theme color.
- Missing favicon handling.
- Project links do not include explicit external-link attributes.

### Accessibility Issues
- Skip link and focus states exist.
- Sidebar navigation is semantic.
- External links should have clearer labels and safe `rel` attributes.
- Project cards should not rely only on visual position to expose the README link.
- Mobile layout needs another pass after visual changes.

### Performance Issues
- Site is lightweight and has no runtime JavaScript.
- CV PDF is the only asset and is acceptable.
- No heavy fonts or dependencies are loaded.
- Performance risk is low; continue avoiding unnecessary dependencies and animations.

## Phases

### Phase 1: Planning and Repository Audit
- Create this `task_plan.md`.
- Record current stack, issues, and improvement phases.
- Commit the plan.

### Phase 2: Content and Project Accuracy
- Updated project cards from current GitHub repositories.
- Fixed NovaCart repository URL and description for `NovaCart-Fashion-Commerce-Platform`.
- Improved project descriptions, features, tech stacks, and learning outcomes.
- Added clearer README links for each project.
- Updated this plan after the phase.

### Phase 3: Visual Hierarchy and Layout
- Refined sidebar presentation with a short site note and calmer link treatment.
- Improved hero rhythm, section spacing, project cards, tags, and note cards.
- Kept the site minimal and personal, without startup landing-page styling.
- Updated this plan after the phase.

### Phase 4: Accessibility and SEO
- Added canonical, Open Graph, Twitter Card, and theme color metadata.
- Added lightweight SVG favicon and social preview assets.
- Improved external-link attributes and README link labels.
- Kept visible focus/hover states.
- Updated this plan after the phase.

### Phase 5: Verification and Documentation
- Ran available static checks with `rg` and `git diff --check`.
- Verified local preview with the browser tool in desktop and mobile widths.
- Checked project README links and local assets.
- Searched for Chinese text, local-only paths, AI-sounding phrases, and dead references.
- Updated README with structure and maintenance notes.
- Ready to push all commits.

## Progress
- [x] Phase 1 complete.
- [x] Phase 2 complete.
- [x] Phase 3 complete.
- [x] Phase 4 complete.
- [x] Phase 5 complete.

## 2026-05-28 Maintenance Audit

### Goal
- Re-check the live personal homepage and local source.
- Test responsive layout, links, accessibility basics, SEO files, and GitHub Pages deployment.
- Fix real issues only, then commit and push.

### Phase 6: Current Site Audit
- Status: complete.
- Review repository state, existing content, and deployment setup.
- Run local static checks and browser checks at desktop, tablet, and mobile widths.
- Record findings in `findings.md` and progress in `progress.md`.

### Phase 7: Targeted Fixes
- Status: complete.
- Fix only the issues found during Phase 6.
- Preserve the simple static HTML/CSS structure.

### Phase 8: Verification, Commit, and Push
- Status: complete.
- Re-run checks, verify the live site or triggered deployment, commit with a clear message, and push to `main`.

## 2026-05-30 Data and AI Portfolio Refresh

### Goal
- Redesign the homepage for IT, data analytics, and AI job-search positioning in New Zealand.
- Use a respected public AI personal site as design inspiration without copying content, layout, assets, or branding.
- Update project emphasis from generic full-stack work to AI tools, data analysis, and practical software evidence.
- Test, commit, push, and verify GitHub Pages deployment.

### Reference Chosen
- Lilian Weng's `Lil'Log` and GitHub Pages repository were chosen as the main reference.
- Reason: it is a well-known AI technical blog with a public GitHub Pages source, strong credibility, clear navigation, concise personal intro, and long-form technical note structure.
- Borrowed principles only: writing-first layout, dated technical notes, readable hierarchy, simple navigation, and credibility through real technical artifacts.

### Phase 9: Research and Current Project Audit
- Status: complete.
- Reviewed Lilian Weng's site and GitHub repository.
- Checked current public GitHub repositories for Yi Han.
- Identified `pansub`, `video-game-sales-ml-analysis`, `ReNova-Second-Hand-C2C-Marketplace`, `study-room-booking-system`, and `teacher-management-system` as relevant projects.

### Phase 10: Content and Visual Redesign
- Status: complete.
- Rewrite hero, profile, projects, notes, skills, and contact sections around IT, data analytics, and AI.
- Keep the site honest, human, and job-search appropriate.
- Keep the implementation plain HTML/CSS and easy to maintain.

### Phase 11: Verification, Commit, and Push
- Status: in progress.
- Run local preview, responsive checks, link checks, text checks, and GitHub Pages deployment verification.

## 2026-05-30 Dark Theme Refresh

### Goal
- Find a highly regarded dark personal developer website as a reference.
- Convert Yi Han's homepage into a dark, professional portfolio suitable for data, AI, and IT job applications.
- Preserve original content direction and do not copy the reference site's text, assets, or exact visual system.

### Reference Chosen
- Brittany Chiang's portfolio and open-source `bchiang7/v4` repository.
- Reason: it is a well-known dark developer portfolio with thousands of stars and forks, and its README documents a dark color system.
- Borrowed principles only: dark technical mood, strong contrast, persistent navigation, project-first credibility, and restrained interaction.

### Phase 12: Dark Visual Refresh
- Status: complete.
- Update theme colors, cards, navigation, metadata, and social preview for a black/dark portfolio.
- Keep the page accessible and readable on mobile and desktop.

### Phase 13: Verification, Commit, and Push
- Status: complete.
- Run local preview, responsive browser checks, link checks, deployment check, then commit and push.

## 2026-05-30 Vue Interaction Upgrade

### Goal
- Add JavaScript and Vue so the homepage feels interactive instead of purely static.
- Preserve the static GitHub Pages deployment path without introducing a heavy build pipeline.
- Keep the effects tied to the portfolio story: data, machine learning, AI workflow thinking, and project exploration.

### Technical Direction
- Use Vue 3 from a CDN with a small controller app, following the official no-build-step approach.
- Keep the existing `index.html` and `styles.css` structure.
- Add a small `app.js` file for state, project filtering, active navigation, scroll progress, AIDLC tabs, and the KNN sketch.

### Phase 14: Vue Enhancement
- Status: complete.
- Add Vue root mounting, project filters, AIDLC tab panels, active navigation state, scroll progress, and an interactive KNN canvas widget.
- Keep all core content visible without JavaScript where possible.

### Phase 15: Verification, Commit, and Push
- Status: complete.
- Run static checks, local preview, browser responsiveness checks, link checks, then commit and push.

### Errors Encountered
- Initial Vue mount tried to control the whole page and cleared the visible DOM in the browser.
- Resolution: changed Vue into a small controller mounted on a hidden root. The static HTML remains visible, while Vue binds events and updates classes, hidden states, scroll progress, and the KNN sketch.

## 2026-06-23 Skills Evidence Redesign

### Goal
- Turn the Skills section into a calmer, recruiter-friendly tool wall.
- Remove nested-card visual weight and rebalance the left and right columns.
- Replace temporary letter glyphs with consistent concept icons.
- Make interaction meaningful: hover previews a tool, click locks it, and the detail panel links skills to real projects.
- Preserve keyboard access, reduced-motion behavior, responsive layout, and static GitHub Pages deployment.

### Phase 16: Audit and interaction model
- Status: complete.
- Review current markup, styles, capability-map code, and project anchors.
- Define the evidence data model and responsive layout.

### Phase 17: Skills implementation
- Status: complete.
- Rebuild the Skills layout, icons, active states, evidence panel, and project links.

### Phase 18: Verification and delivery
- Status: complete.
- Run syntax, diff, resource, desktop, mobile, keyboard, and reduced-motion checks.
- Commit and push the finished update to the current PR branch.

### Environment errors
- python resolves to the Windows Store placeholder, so the planning session-catchup script could not run.
- py is not installed. Continued from a clean Git working tree and the existing planning files.

## 2026-06-23 Recruiter-Focused Hero Redesign

### Goal
- Make Yi Han's name, professional direction, strongest evidence, and availability scannable within the first viewport.
- Replace tentative or potentially misleading employment language with an honest, static positioning statement.
- Turn the KNN widget into a contextualized portfolio proof point with source and project links.
- Reduce repetition and hero height so the next section is visible on common desktop and mobile viewports.

### Phase 19: Positioning and content hierarchy
- Status: complete.
- Rewrite the hero around Yi Han, Business Analytics, Master of IT, and practical data/AI/software work.
- Define clear primary and secondary actions plus a compact proof strip.

### Phase 20: Hero implementation
- Status: complete.
- Replace the role rotator, repeated profile facts, and weak text links.
- Refine the responsive layout, KNN context, and project evidence links.

### Phase 21: Verification and delivery
- Status: complete.
- Run syntax, accessibility, responsive, interaction, console, and overflow checks.
- Commit and push the recruiter-focused update to the existing PR branch.
