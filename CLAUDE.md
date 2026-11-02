# CLAUDE.md – Review of Maritime Transport 2026 minisite

Handover notes and working rules for developers (and AI coding assistants) working on this project. Read `README.md` for the public-facing overview; this file covers how the project is built, how to change it safely and how to ship it.

## What this is

The interactive web publication for UNCTAD's **Review of Maritime Transport 2026**. It is a Vite + React + MDX single-page app that is embedded into UNCTAD's Drupal site.

* Production page: https://unctad.org/publication/review-maritime-transport-2026 (URL to be confirmed; Drupal embeds the JS/CSS from `https://storage.unctad.org/2026-rmt_report/`)
* Demo: https://unctad-infovis.github.io/2026-rmt_report/
* Scaffolded with the `un-init-project` tool. Main reference project: `../2026-tdr_report` (also `../2026-wir_report`); previous edition: `../../2025/2025-rmt_report` (old webpack stack, 6 chapters). Design references: `../2026-cdde`, `../2026-global_trade_update`.

## Quick start

```sh
npm install        # needs GITHUB_PACKAGES_TOKEN in the environment (see .npmrc)
npm run start      # dev server on http://localhost:8080
npx biome check src  # lint + format check (npm run lint:fix to auto-fix)
npm run build      # builds into dist/ and runs scripts/postbuild.js
```

The dev server is usually already running on port 8080. Check with `curl -s localhost:8080` before starting another one.

## Where things live

| Path | Purpose |
| --- | --- |
| `src/Article.mdx` | The whole narrative: copy plus placement of every component. Most content edits happen here. `props.meta` is `src/meta.json`. |
| `src/meta.json` | Title, subtitle, year, hero image, overview/full-report PDF URLs, chapter list (title, subtitle, images, chapter `pdf_url`) and `footer` content. |
| `src/jsx/Index.jsx` | Main entry. Wraps the app in `UNCTADSiteHeader` when `show_site_header` is true and the host is not unctad.org. |
| `src/jsx/App.jsx` | Registers the components available in MDX and sets theme variables (`--main-color` = `--un-color-red`, `--un-column-width` = 920px). |
| `src/jsx/App.css` | Project-specific styles: body copy, takeaway / calls-to-action boxes, quotes, side-scrolling text overlay, progress bar, back-to-top, reduced-motion rules. |
| `src/jsx/components/minisite/` | Local versions of the minisite layout: `Header` (hero), `HeaderChapter`, `Footer`, `InNumbers` (chapter data sheets), shared `minisite.css`. |
| `public/assets/img/` | Images. Hero is `2026-rmt_report_main_v2.jpg`; `2026-rmt_report_main.jpg` is kept as the alternative hero. |
| `scripts/postbuild.js` | Rewrites absolute asset paths in built HTML/CSS to relative ones. |
| `dist/` | **Committed** build output. It is what gets deployed. |
| `tmp/` | Local scratch files from the editors (source images, Word docs). Not ignored by git – never commit it. |

## Content conventions

* Datawrapper charts are embedded with `<ChartDataWrapper chart_id="xxxxx" />` (from `@unctad-infovis/general-tools`). 
* Skeleton status: six placeholder chapters (titles from the 2025 edition, to be revised). Planned chapter pattern: `SideScrollingText` (chapter intro with background image and blue veil) → `HeaderChapter` → takeaway box (`.highlight_container`) → `InNumbers` data sheet → body copy and charts → calls to action (`.highlight_container.calls_to_action`).
* `HeaderChapter` hides the subtitle when the title already contains it, and puts a line break before that part of the title (chapter 2).
* `InNumbers` props: `headline`, `headlinePrefix`, `headlineUnit`, `headlineDecimals`, `headlineLabel` (screen-reader text), `headlineText`, plus one visual: `bars`, `pair` (two `CircleFlag` country codes) or `share`. `facts` take an `icon` key from the `ICONS` map in `InNumbers.jsx`.
* Footer blocks render only when their content exists in `meta.json` → `footer` (video, language links, launch event, media links). Empty `url` values hide the item.
* Chapter PDF download buttons appear only when `pdf_url` is filled in `meta.json`.
* Use a plain hyphen-minus `-` for negative numbers in content (e.g. `-20%`), not the Unicode minus `−`.

## Paths and assets

* Always resolve image paths with `resolveAsset()` from `@unctad-infovis/general-tools/helpers/BasePath.js` (the shared `Image` and `SideScrollingText` already do). It maps to `https://storage.unctad.org/2026-rmt_report/` on unctad.org, `./` on localhost and the GitHub Pages URL elsewhere. Raw relative paths break in production.
* CSS `url()` paths are fixed by `scripts/postbuild.js`.
* Bump the `?v=` query on image URLs in `meta.json` / `Article.mdx` when replacing an image with the same filename.
* Keep hero/background images around 2000px wide and well compressed (current hero ≈ 750 KB).

## Styling rules

* All styles are scoped under `#app-root-2026-rmt_report .app` (add `:is()` selectors if standalone entries are added).
* Use design tokens from `@unctad-infovis/general-tools` for font sizes, weights and colours (`--un-font-size-*`, `--un-font-weight-*`, `--un-color-*`). There is no black token; use `#000`.
  * Key colours: `--un-color-blue` #009edb, `--un-color-blue-text-dark` #005392 (takeaway and In numbers backgrounds), `--un-color-blue-darkest` #004987, `--un-color-red` #ed1847 (main colour), `--un-color-yellow` #fbaf17.
* Native CSS nesting mirroring the HTML structure, properties in alphabetical order, no blank lines between rules.
* Content max width: 920px column for body copy; the hero is 1350px wide (0 padding) from 1400px viewport up, and 1170px with 10px padding below that. Never exceed 1350px for content; full-bleed backgrounds may go 100% wide.
* Responsive by default (`clamp()` and media queries). Respect `prefers-reduced-motion`.
* Avoid the class name `share_label`; the general-tools `ButtonShare` styles it globally. `.hidden` (display none) comes from general-tools.
* Biome flags `noDescendingSpecificity` and `noImportantStyles`; use a `biome-ignore` comment with a reason when the override is intentional.
* Side-scrolling sections: the UN blue veil (`.background::after`, opacity 0.7) fades in and out with scroll via the `side-scroll-overlay` keyframes and a `view-timeline`; browsers without scroll-driven animations show a constant veil.

## Chart rules (all charts, all UNCTAD projects)

* Line charts use straight segments only (no D3 curve/spline interpolation). Default line stroke width 5px.
* Numbers inside charts, tooltips, axes and tables use a space as the thousands separator (`60 000`). For D3, set `d3.formatDefaultLocale({ decimal: '.', grouping: [3], thousands: ' ', currency: ['$', ''] })`.
* Chart titles use the `2026-cdde` arrow style; source/note lines use the `2026-cdde` `ChartMeta` style.
* Source lines spell out "UN Trade and Development (UNCTAD)" on first mention.

## Shared packages – reuse before writing new code

Components and helpers come from the `un-init-project` monorepo, published to GitHub Packages:

* `@unctad-infovis/general-tools` – `ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `CircleFlag`, `Image`, `ProgressBar`, `Quote`, `RollingNumber`, `BackToTop`, `UNCTADSiteHeader`, helpers (`BasePath`/`resolveAsset`, `UseIsVisible`, `FormatNr`, …) and design tokens.
* `@unctad-infovis/minisite-tools` – `Header`, `HeaderChapter`, `Footer`, `SideScrollingText`. This project uses the shared `SideScrollingText` (registered, not yet used) but has local, customised copies of `Header`, `HeaderChapter` and `Footer` in `src/jsx/components/minisite/`.

Check these packages (and sibling projects) before creating a new component.

## Verifying changes

* Run `npx biome check src` before committing.
* Check changes in a browser at desktop and mobile widths (e.g. 1440, 768, 390, 320px). Playwright scripts are handy for measuring computed styles and taking screenshots; keep such scripts and screenshots out of the repo.

## Git, build and deployment

Remotes: `origin` (GitHub, `unctad-infovis/2026-rmt_report`) and `unctad` (Azure DevOps). Work directly on `main` unless told otherwise.

Standard release flow:

```sh
npx biome check src
npm run build                       # updates dist/
git add dist src public/assets/img/<new files>   # never add tmp/ or package-lock.json unless dependencies changed
git commit -m "Short description"   # no AI co-author trailers, no em dashes
npm run push                        # pushes to origin and unctad
npm run sync-gh-pages               # demo: subtree-pushes dist/ to gh-pages
npm run login                       # once per session, needs AZURE_USER / AZURE_PW / AZURE_TENANT
npm run sync-prod                   # azcopy js, css and assets to storage.unctad.org (needs AZURE_STORAGE_NAME)
```

Afterwards verify that `git rev-parse HEAD origin/main unctad/main` all return the same commit.

Notes:

* `sync-prod` uploads only `js`, `css` and `assets` – the Drupal page owns the HTML.
* Entry JS (`js/2026-rmt_report.min.js`) and the combined CSS keep stable names; shared chunks are content-hashed. Bump the `?v=` on the Drupal embed snippet when caching is an issue.
* Commit messages: plain, descriptive, no `Co-authored-by` lines for AI tools, no em dashes (use an en dash – if needed).

## Contacts

Rights of usage and questions: Teemo Tebest (UNCTAD).
