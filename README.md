# 2026-rmt_report

**Live demo** https://unctad-infovis.github.io/2026-rmt_report/

## About

The Review of Maritime Transport (RMT) is an annual UNCTAD flagship publication on
international maritime trade, shipping and ports. This project is the interactive
web publication page for the 2026 edition: a scrollytelling minisite with
narrative text, data visualisations and chapter navigation, embedded in UNCTAD's
Drupal platform. Content is authored in MDX (`src/Article.mdx`).

Status: skeleton. Content, images and URLs are placeholders (see `src/meta.json`).
Developer notes are in [`CLAUDE.md`](CLAUDE.md).

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-rmt_report/js/2026-rmt_report.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-rmt_report/css/2026-rmt_report.min.css?v=1">
<div class="app-root-2026-rmt_report" id="app-root-2026-rmt_report">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to bust the cache.

## Used in

* Review of Maritime Transport 2026 (URL to be confirmed)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`
* `npx biome check src` – lint and format check (`npm run lint:fix` to fix).

Project should start at: http://localhost:8080

For developing please refer to `package.json`

### Deployment

* `npm run build` – production bundle into `dist/` (runs `scripts/postbuild.js` to make asset paths relative). `dist/` is committed.
* `npm run push` – push `main` to both remotes: `origin` (GitHub) and `unctad` (Azure DevOps).
* `npm run sync-gh-pages` – push `dist/` to the `gh-pages` branch for the live demo.
* `npm run login` – Azure service-principal login (needs `AZURE_USER`, `AZURE_PW`, `AZURE_TENANT`).
* `npm run sync-prod` – copy `js`, `css` and `assets` to Azure blob storage (needs `AZURE_STORAGE_NAME`).

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

* `src/meta.json` – title, subtitle, year, hero image, PDF URLs, chapter list and footer content.
* `src/Article.mdx` – the full narrative (copy + component placement).
* `src/jsx/App.jsx` – component registry passed to the MDX and theme colours.
* `src/jsx/App.css` – project-specific layout and narrative styles.
* `src/jsx/components/minisite/` – local `Header`, `HeaderChapter`, `Footer`, `InNumbers`, `IntroVideo` and `ReportCard`.
* `public/assets/img/` – images.

## Packages

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** — report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* none yet (add `d3` if custom charts are needed)

### Formatter & Linter

* **@biomejs/biome** – formats and lints JS, JSX and CSS, replaces ESLint + Prettier

### Minification

* **terser** – minifies the production bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** – compiles MDX files into React components
* **@mdx-js/react** – provides React context for MDX components

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components