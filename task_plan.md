# Portfolio Improvement Plan

## Current Audit

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

### SEO and Social Preview Issues
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
- Update project cards from current GitHub repositories.
- Fix NovaCart repository URL and description.
- Improve project descriptions, features, tech stacks, and learning outcomes.
- Add clearer README links.
- Update this plan after the phase.

### Phase 3: Visual Hierarchy and Layout
- Refine sidebar presentation.
- Improve hero rhythm, section spacing, project cards, tags, and note cards.
- Keep the site minimal and personal, without startup landing-page styling.
- Update this plan after the phase.

### Phase 4: Accessibility and SEO
- Add canonical, Open Graph, Twitter Card, and theme color metadata.
- Add favicon support without heavy assets.
- Improve external-link attributes and visible focus/hover states.
- Check keyboard and mobile behavior.
- Update this plan after the phase.

### Phase 5: Verification and Documentation
- Run available checks.
- Verify local preview in desktop and mobile widths.
- Check links and assets.
- Search for Chinese text, local-only paths, AI-sounding phrases, and dead references.
- Update README if needed.
- Push all commits.

## Progress
- [x] Phase 1 started.
- [ ] Phase 2 pending.
- [ ] Phase 3 pending.
- [ ] Phase 4 pending.
- [ ] Phase 5 pending.
