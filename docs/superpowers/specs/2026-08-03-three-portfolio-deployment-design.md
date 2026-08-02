# Three Portfolio Deployment Design

## Objective

Maintain three independent GitHub Pages portfolios, each with one clear purpose:

| Public URL | Repository | Purpose |
| --- | --- | --- |
| `https://hannnnnnnny.github.io/` | `hannnnnnnny.github.io` | Combined data analytics, AI, and software engineering portfolio |
| `https://hannnnnnnny.github.io/yi-han-data-analytics/` | `yi-han-data-analytics` | Data analytics and AI portfolio |
| `https://hannnnnnnny.github.io/yi-han-software-engineer/` | `yi-han-software-engineer` | Software engineering and full-stack portfolio |

Each site remains a plain HTML, CSS, and JavaScript project deployed from the root of the `main` branch through GitHub Pages.

## Verified Baselines

- The current root repository commit `77039f1` contains the intended data analyst portfolio.
- Root repository commit `d0fa959` is the approved pre-split combined portfolio. It includes the Ctrl+K command palette, machine-learning interaction, data and software projects, and the complete mixed technical stack.
- The current software engineering repository commit `6f20ded` is the approved software engineering portfolio and requires no content change.
- The current data analytics repository commit `fa9c20f` contains a different, simpler design and will be replaced by the approved data analyst portfolio from the root repository.

## Repository Changes

### Data Analytics Repository

Copy the published data analyst site from root commit `77039f1` into `yi-han-data-analytics`.

The migrated site must retain:

- the `Data Analyst | Yi Han` role-first hero;
- the existing machine-learning visualisation and JavaScript interactions;
- Ctrl+K navigation;
- the data-focused project selection, skills, notes, and contact content;
- the existing responsive and accessibility behaviour.

Adjust repository-specific references after migration:

- canonical URL and Open Graph URL;
- Open Graph and Twitter preview asset URLs;
- `robots.txt` sitemap location;
- `sitemap.xml` page location;
- GitHub source links that currently point to `hannnnnnnny.github.io`;
- README title, purpose, public URL, and maintenance notes.

Synchronise the `assets` directory with the migrated site so obsolete assets from the replaced design are not retained.

### Root Repository

Restore the published site files from root commit `d0fa959` without rewriting the design. This restoration covers the runtime files and assets that determine the public page:

- `index.html`;
- `styles.css`;
- `app.js`;
- `assets/`;
- `.nojekyll`;
- `robots.txt`;
- `sitemap.xml`;
- `README.md` where it describes the public site.

Retain later internal planning and specification documents because they do not affect GitHub Pages output and preserve project history.

The restored root site must again show the combined project and skill set rather than acting as a hub or a role-specific data portfolio.

### Software Engineering Repository

Do not change the published software engineering site. Use it as a regression target during final validation to confirm that the other deployments did not affect it.

## Commit Strategy

Use focused commits in the repositories that change:

1. Root repository: commit this design specification.
2. Data analytics repository: migrate the approved data analyst portfolio and correct subpath-specific metadata.
3. Root repository: restore the approved combined portfolio from `d0fa959`.

No commit is required in `yi-han-software-engineer` unless verification finds an actual deployment defect.

## Verification

Before pushing:

- confirm each changed repository has only intended files in its diff;
- search for stale canonical URLs, sitemap URLs, source repository links, and asset paths;
- check that all internal assets use paths that work at the repository subpath;
- serve both changed sites locally and test desktop and mobile layouts;
- test keyboard navigation, visible focus states, Ctrl+K, project filters, and interactive visualisations;
- verify project and external links;
- confirm no Chinese text appears in published files.

After pushing:

- confirm GitHub Pages reports a successful deployment for both changed repositories;
- request all three public URLs and require HTTP 200 responses;
- verify the live page titles are respectively the combined portfolio, `Data Analyst | Yi Han`, and `Software Engineer | Yi Han`;
- verify CSS, JavaScript, images, social preview assets, sitemap files, and project links load without 404 responses;
- perform desktop and mobile browser checks on the two changed sites;
- recheck the software engineering site as an unchanged regression target.

## Rollback

If either deployment fails, revert only the commit in the affected repository. The source commits `77039f1`, `d0fa959`, and `6f20ded` remain immutable recovery points.
