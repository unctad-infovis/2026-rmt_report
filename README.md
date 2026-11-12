# 2026-rmt_report

**Live demo** https://unctad-infovis.github.io/2026-rmt_report/

## About

The Review of Maritime Transport (RMT) is an annual UNCTAD flagship publication
on international maritime trade, shipping fleets and services, freight rates,
ports and regulatory developments. This project is the interactive web
publication page for the 2026 edition: a scrollytelling minisite with narrative
text, data visualisations and chapter navigation.

Content is authored in MDX (`src/Article.mdx`) and rendered as a standalone React
application that is embedded within UNCTAD's Drupal platform.

The page has an introduction and six chapters. Each chapter has a chapter header
with optional PDF download, a takeaway box, the narrative with Datawrapper
charts and a custom D3 focus chart (Chapter 1), and calls to action. A footer links to the full report, video and press
material.

Developer handover notes and working rules are in [`CLAUDE.md`](CLAUDE.md).

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-rmt_report/js/2026-rmt_report.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-rmt_report/css/2026-rmt_report.min.css?v=1">
<div class="app-root-2026-rmt_report" id="app-root-2026-rmt_report">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to match the current build version to bust the cache.
Shared JavaScript chunks use content-hashed filenames, so changes bypass Azure/CDN caches.

## Used in

* Review of Maritime Transport 2026 (URL to be confirmed)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install` (requires a `GITHUB_PACKAGES_TOKEN` environment variable, see Packages)
* `npm run start`

Project should start at: http://localhost:8080

* `npx biome check src` – lint and format check (`npm run lint:fix` to fix).

For developing please refer to `package.json`.

### Deployment

* `npm run build` – production bundle into `dist/` (runs `scripts/postbuild.js` to
  rewrite absolute HTML and CSS asset paths to relative). `dist/` is committed.
* `npm run push` – push `main` to both remotes: `origin` (GitHub) and `unctad` (Azure DevOps).
* `npm run sync-gh-pages` – push `dist/` to the `gh-pages` branch for the live demo.
* `npm run login` – Azure service-principal login (needs `AZURE_USER`, `AZURE_PW`, `AZURE_TENANT`).
* `npm run sync-prod` – copy `js`, `css` and `assets` from the build to Azure blob
  storage (`storage.unctad.org`, needs `AZURE_STORAGE_NAME`).

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

* `src/meta.json` – report title, subtitle, year, hero image, overview/full-report
  URLs, chapter list (titles, subtitles, images, chapter PDF URLs) and footer content.
* `src/Article.mdx` – the full narrative (copy + component placement).
* `src/jsx/App.jsx` – component registry passed to the MDX and theme colours.
* `src/jsx/App.css` – project-specific layout and narrative styles.
* `src/jsx/components/minisite/` – local hero (`Header`), `HeaderChapter`, `Footer`,
  `InNumbers`, `IntroVideo` and `ReportCard` components.
* `src/jsx/components/crude/` – Chapter 1 focus chart (Figures I.9 and I.10), D3.
* `src/jsx/components/shared/FocusChartStory.jsx` – shared scroll activation and layout for focus charts.
* `scripts/postbuild.js` – makes built asset paths relative.
* `public/assets/img/` – images.

### Content driven by `meta.json`

* Chapter PDF download buttons (hero cards and chapter headers) appear only when
  the chapter's `pdf_url` is set.
* Footer blocks appear only when their content exists under `footer`: the video
  (`video_url`), language links, the launch event (`launch_event_url`), media
  links and press videos. Items with an empty `url` are hidden.
* Missing images (hero, overview, chapter cards) are skipped.

## Chapter 1 focus chart

`crude/ChartFocusCrude.jsx` shows estimated daily crude oil movements out of the
Persian Gulf and east from the Red Sea (Figures I.9 and I.10) instead of a
Datawrapper embed. Its five scroll stages (`STAGES` in the component) introduce
the Persian Gulf line, the Red Sea line, the 28 February disruption marker with
period averages, the late-June to early-July recovery and the combined view.
`shared/FocusChartStory.jsx` keeps the chart sticky beside the explanation panels.

* Data lives in `crude/data.js` as `[date, persian_gulf, red_sea_eastbound]` rows
  in million tons per day (seven-day moving averages, 2 January–26 July 2026),
  converted from the authors' Datawrapper CSVs, which are in thousand tons.
  `DISRUPTION_DATE`, `AVERAGES` and `RECOVERY` in the same file drive the marker,
  average lines and highlighted band.
* Hover, tap or use the keyboard (arrow keys, Home, End, Escape) on the plot for
  a tooltip. A "Get the data" link downloads the series as CSV.
* Reduced-motion users and print see the final stage.
* Line charts use straight segments, 3px strokes (thinner than the 5px default because of the dense daily data) and a space as the thousands separator.

## Packages

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** – shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `CircleFlag`, `Image`, `RollingNumber`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** – report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* **d3** – the custom Chapter 1 focus chart. Other charts are Datawrapper embeds via `ChartDataWrapper`.

### Build & Dev Server

* **vite** – development server with hot module replacement and production bundler
* **@vitejs/plugin-react** – adds React and JSX support to Vite

### React

* **react** – UI component library
* **react-dom** – renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** – formats and lints JS, JSX and CSS files, replaces ESLint + Prettier

### Minification

* **terser** – minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** – Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** – provides React context for MDX components
