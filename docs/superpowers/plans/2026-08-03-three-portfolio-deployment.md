# Three Portfolio Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish separate data analytics and software engineering portfolios while restoring the root GitHub Pages site to the approved pre-split combined portfolio.

**Architecture:** Keep three independent plain HTML, CSS, and JavaScript repositories deployed from `main` through GitHub Pages. Migrate the root repository's current data analyst runtime into `yi-han-data-analytics`, restore the root runtime from immutable commit `d0fa959`, and leave `yi-han-software-engineer` unchanged as a regression target.

**Tech Stack:** HTML5, CSS, JavaScript, Git, GitHub Pages, PowerShell, Python static HTTP server, Playwright browser verification.

## Global Constraints

- Root URL must publish the combined data analytics, AI, and software engineering portfolio from commit `d0fa959`.
- `/yi-han-data-analytics/` must publish the data analyst portfolio currently represented by root commit `77039f1`.
- `/yi-han-software-engineer/` must remain unchanged at commit `6f20ded` unless a real defect is discovered.
- Preserve Ctrl+K, the machine-learning interaction, project filters, responsive behaviour, keyboard focus states, and existing external project links.
- Use only repository-relative runtime asset paths and repository-specific absolute canonical, social preview, sitemap, and source URLs.
- Do not add dependencies or migrate frameworks.
- Do not add Chinese text to published files.
- Commit each repository's meaningful change separately and push only after local checks pass.

---

### Task 1: Migrate the approved data analyst portfolio

**Files:**
- Replace: `../yi-han-data-analytics/index.html`
- Replace: `../yi-han-data-analytics/styles.css`
- Create: `../yi-han-data-analytics/app.js`
- Replace: `../yi-han-data-analytics/assets/**`
- Modify: `../yi-han-data-analytics/robots.txt`
- Modify: `../yi-han-data-analytics/sitemap.xml`
- Modify: `../yi-han-data-analytics/README.md`
- Preserve: `../yi-han-data-analytics/.nojekyll`

**Interfaces:**
- Consumes: published root runtime at commit `77039f1`.
- Produces: a subpath-safe data portfolio at `https://hannnnnnnny.github.io/yi-han-data-analytics/`.

- [ ] **Step 1: Verify repository baselines and clean worktrees**

Run from `portfolio-audit`:

```powershell
git -C hannnnnnnny.github.io status --short
git -C yi-han-data-analytics status --short
git -C yi-han-software-engineer status --short
git -C hannnnnnnny.github.io rev-parse --short HEAD
git -C yi-han-data-analytics rev-parse --short HEAD
git -C yi-han-software-engineer rev-parse --short HEAD
```

Expected: only the already committed design/plan history differs from remote in the root repository; all three working trees are clean. The data and software repositories remain at `fa9c20f` and `6f20ded` respectively.

- [ ] **Step 2: Replace the data repository runtime with the approved data runtime**

Copy `index.html`, `styles.css`, `app.js`, `.nojekyll`, `robots.txt`, `sitemap.xml`, and the complete `assets` directory from root commit `77039f1`. Remove the old data repository runtime assets before copying so no obsolete files remain.

Use an explicit temporary archive from the immutable source commit:

```powershell
git -C hannnnnnnny.github.io archive --format=zip --output ..\data-runtime.zip 77039f1 index.html styles.css app.js .nojekyll robots.txt sitemap.xml assets
Expand-Archive ..\data-runtime.zip -DestinationPath ..\data-runtime -Force
```

Before deleting the old assets, resolve the target and require it to equal the data repository's `assets` directory. Then replace only the listed runtime files and directory.

- [ ] **Step 3: Correct subpath-specific metadata and source links**

Apply these exact replacements in `../yi-han-data-analytics/index.html`:

```text
https://hannnnnnnny.github.io/
-> https://hannnnnnnny.github.io/yi-han-data-analytics/

https://hannnnnnnny.github.io/assets/social-preview.svg
-> https://hannnnnnnny.github.io/yi-han-data-analytics/assets/social-preview.svg

https://github.com/hannnnnnnny/hannnnnnnny.github.io/blob/main/app.js
-> https://github.com/hannnnnnnny/yi-han-data-analytics/blob/main/app.js
```

Set `robots.txt` to:

```text
User-agent: *
Allow: /

Sitemap: https://hannnnnnnny.github.io/yi-han-data-analytics/sitemap.xml
```

Set the single `<loc>` in `sitemap.xml` to:

```xml
<loc>https://hannnnnnnny.github.io/yi-han-data-analytics/</loc>
```

Rewrite `README.md` so it identifies the repository as Yi Han's data analytics and AI portfolio, links to the data site URL, states that it uses plain HTML/CSS/JavaScript, and names `index.html`, `styles.css`, `app.js`, and `assets/` as the maintained runtime files.

- [ ] **Step 4: Run static migration checks**

Run:

```powershell
rg -n "hannnnnnnny.github.io/assets|hannnnnnnny.github.io/$|hannnnnnnny.github.io/blob/main/app.js" yi-han-data-analytics
rg -n "yi-han-data-analytics" yi-han-data-analytics/index.html yi-han-data-analytics/robots.txt yi-han-data-analytics/sitemap.xml yi-han-data-analytics/README.md
rg -n "[\p{Han}]" yi-han-data-analytics/index.html yi-han-data-analytics/styles.css yi-han-data-analytics/app.js yi-han-data-analytics/README.md
git -C yi-han-data-analytics diff --check
```

Expected: the stale-root search and Chinese-text search return no matches; the data-subpath search finds canonical, social, sitemap, source, and README references; `git diff --check` exits successfully.

- [ ] **Step 5: Serve and test the data site locally**

Serve `portfolio-audit` as the web root so the repository subpath matches production:

```powershell
python -m http.server 4173 --directory portfolio-audit
```

Verify `http://127.0.0.1:4173/yi-han-data-analytics/` at desktop and mobile widths. Require the `Data Analyst | Yi Han` title, loaded CSS and JavaScript, working Ctrl+K, working model interaction and speed control, working project filters, visible keyboard focus, and no console errors or failed asset requests.

- [ ] **Step 6: Commit the data site migration**

```powershell
git -C yi-han-data-analytics add .nojekyll README.md app.js assets index.html robots.txt sitemap.xml styles.css
git -C yi-han-data-analytics commit -m "feat: deploy full data analytics portfolio"
```

Expected: one commit containing only the approved data-site migration.

### Task 2: Restore the approved combined root portfolio

**Files:**
- Restore: `README.md`
- Restore: `app.js`
- Restore: `index.html`
- Restore: `styles.css`
- Restore: `assets/**`
- Restore: `.nojekyll`
- Restore: `robots.txt`
- Restore: `sitemap.xml`
- Preserve: `docs/superpowers/specs/2026-08-03-three-portfolio-deployment-design.md`
- Preserve: `docs/superpowers/plans/2026-08-03-three-portfolio-deployment.md`

**Interfaces:**
- Consumes: combined site tree from root commit `d0fa959`.
- Produces: the combined portfolio at `https://hannnnnnnny.github.io/`.

- [ ] **Step 1: Restore the published runtime from `d0fa959`**

Run in the root repository:

```powershell
git restore --source d0fa959 --worktree -- README.md app.js index.html styles.css assets .nojekyll robots.txt sitemap.xml
```

This restores only published runtime and public documentation. It does not remove later internal specifications or plans.

- [ ] **Step 2: Verify exact runtime restoration**

Run:

```powershell
git diff --quiet d0fa959 -- README.md app.js index.html styles.css assets .nojekyll robots.txt sitemap.xml
git diff --check
rg -n "<title>|Selected GitHub projects|project-renova|project-video-game-sales|command-palette" index.html
rg -n "[\p{Han}]" index.html styles.css app.js README.md
```

Expected: the comparison with `d0fa959` exits successfully; the combined-site markers are present; the Chinese-text search returns no matches; `git diff --check` exits successfully.

- [ ] **Step 3: Serve and test the combined root site locally**

Using the same local server, verify `http://127.0.0.1:4173/hannnnnnnny.github.io/` at desktop and mobile widths. Require the Yi Han combined hero, data and software projects, complete mixed technical stack, Ctrl+K, the machine-learning interaction, project filters, visible keyboard focus, and no console errors or failed asset requests.

- [ ] **Step 4: Commit the root restoration**

```powershell
git add README.md app.js index.html styles.css assets .nojekyll robots.txt sitemap.xml
git commit -m "restore: bring back combined portfolio homepage"
```

Expected: one restoration commit; the design and implementation plan commits remain intact.

### Task 3: Verify, publish, and check all three live sites

**Files:**
- No new production files.

**Interfaces:**
- Consumes: committed root and data repository changes.
- Produces: two successful GitHub Pages deployments and one verified unchanged software site.

- [ ] **Step 1: Run final local repository checks**

```powershell
git -C hannnnnnnny.github.io status --short
git -C yi-han-data-analytics status --short
git -C yi-han-software-engineer status --short
git -C hannnnnnnny.github.io log -3 --oneline
git -C yi-han-data-analytics log -2 --oneline
```

Expected: all worktrees are clean; root history contains the design, plan, and restoration commits; data history contains the migration commit; software remains unchanged.

- [ ] **Step 2: Push the two changed repositories**

```powershell
git -C yi-han-data-analytics push origin main
git -C hannnnnnnny.github.io push origin main
```

Expected: both pushes update `main` successfully. Do not push the unchanged software repository.

- [ ] **Step 3: Wait for GitHub Pages deployments**

Poll these endpoints until `status` is `built` and the latest deployment reflects the pushed commit:

```powershell
gh api repos/hannnnnnnny/yi-han-data-analytics/pages
gh api repos/hannnnnnnny/hannnnnnnny.github.io/pages
```

If a Pages build fails, inspect the corresponding Actions or Pages build details before changing code.

- [ ] **Step 4: Verify live HTTP responses and identities**

Request:

```text
https://hannnnnnnny.github.io/
https://hannnnnnnny.github.io/yi-han-data-analytics/
https://hannnnnnnny.github.io/yi-han-software-engineer/
```

Require HTTP 200 and these identities:

```text
Root: combined Yi Han portfolio with "Selected GitHub projects"
Data: title and H1 "Data Analyst | Yi Han"
Software: title and H1 "Software Engineer | Yi Han"
```

Request each site's CSS, JavaScript, social preview asset, robots file, and sitemap file directly and require HTTP 200.

- [ ] **Step 5: Run live desktop and mobile browser checks**

Use Playwright against all three public URLs. On root and data, test Ctrl+K, close behaviour, project filters, interactive controls, navigation anchors, keyboard focus, responsive layout, console errors, and failed network requests. On software, confirm the current presentation remains unchanged and functional.

- [ ] **Step 6: Report the deployment mapping and commit IDs**

Report the final URL-to-repository mapping, the commits pushed to root and data, all commands used for verification, and any residual issue. Do not claim completion without fresh live evidence.
