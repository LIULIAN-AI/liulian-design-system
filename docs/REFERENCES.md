---
title: LIULIAN — Consolidated external references
status: living document
owner: Linlin Jia (jajupmochi)
created: 2026-05-21
update_rule: append new sources here whenever a strategy / redesign /
             research document cites a URL; re-audit every six months.
---

# LIULIAN external references — one place

This document is the **single index** for every external site, paper, or
tool LIULIAN's strategy and redesign work has drawn from. If a doc
elsewhere cites a URL, that URL should also appear here, with a one-line
description and a category.

If you're trying to find "where did we read about X?" — search this file
first. Detailed write-ups live in companion docs (linked per entry).

## Companion docs (LIULIAN-internal)

| Doc | Purpose |
|---|---|
| [`REFERENCE_DESIGNS.md`](REFERENCE_DESIGNS.md) | 12-platform deep memory bank (what we steal vs. what we avoid) |
| [`PLATFORM_DESIGN.md`](PLATFORM_DESIGN.md) | BI canvas spec — bento, panels, scientific running header |
| [`PLATFORM_BLUEPRINT.md`](PLATFORM_BLUEPRINT.md) | 9-repo federation + roadmap to pre-seed |
| [`NEOBANKER_REUSE_MAP.md`](NEOBANKER_REUSE_MAP.md) | Where we reused vs. rewrote vs. dropped from the prior fintech project |
| [`conventions/UI_AUDIT_CHECKLIST.md`](conventions/UI_AUDIT_CHECKLIST.md) | 46-item PR merge gate; absolute bans |
| [`redesign-2026-05-20/00-plan.md`](redesign-2026-05-20/00-plan.md) | R1–R5 plan (forecast canvas) |
| [`redesign-2026-05-21/00-plan.md`](redesign-2026-05-21/00-plan.md) | R6–R8 plan (dashboard layer + twin-track editing) |
| [`redesign-2026-05-21/00-research.md`](redesign-2026-05-21/00-research.md) | Web research synthesis for R6–R8 |

## 1 · Dashboard / BI patterns (2026 surveys)

| Source | Used for |
|---|---|
| [Power BI · April 2026 Feature Summary](https://powerbi.microsoft.com/en-us/blog/power-bi-april-2026-feature-summary/) | Chart picker UX · in-visual style picker that persists with Format pane · Copilot edits + "view as code" |
| [Notion 3.4 release (2026-03-26)](https://www.notion.com/releases/2026-03-26) | Inline AI canvas-style editing |
| [Databricks AI/BI release notes (2026)](https://docs.databricks.com/aws/en/ai-bi/release-notes/2026) | Natural-language → SQL → chart + narrative |
| [Deepnote · AI data-visualisation tools](https://deepnote.com/blog/ai-data-visualization-tools) | Notebook + chart side-by-side; cell = chart spec |
| [Future AI · "AI for Creating Dashboards in 2026"](https://futureagi.com/blog/ai-for-creating-dashboards/) | Survey of Copilot / Tableau Pulse / Mode AI / Looker+Gemini / ThoughtSpot Sage |
| [Learning Collider · "Power BI, Tableau, and Hex"](https://blog.learningcollider.org/power-bi-tableau-and-hex-oh-my-18a2246b4080) | Three-tool comparison |
| [Hex](https://hex.tech/) | "Magic" inline AI-generated cells |
| [Zebra BI · choose the right chart](https://zebrabi.com/how-to-choose-the-right-chart-power-bi/) | Picker mental-model: compare / trend / distribution / composition / relationship |

## 2 · Visualization libraries

| Library | License | Use in LIULIAN |
|---|---|---|
| [ECharts](https://echarts.apache.org/) | Apache-2.0 | Rendering engine for the BI canvas charts (already wired) |
| [Plotly.js](https://github.com/plotly/plotly.js) | MIT | Considered for richer chart-type coverage (≈ 1.8 MB min) |
| [Vega-Lite](https://vega.github.io/vega-lite/) | BSD-3 | Grammar-based spec format we borrowed for `LiulianChartSpec` |
| [Observable Plot](https://observablehq.com/plot/) | ISC | Declarative D3 wrapper; considered for default charts |
| [npm-compare — chart.js / d3 / plotly / vega-lite](https://npm-compare.com/chart.js,d3,plotly.js,vega-lite) | – | Bundle-size / API-shape comparison |

## 3 · Visual-editing tools (twin-track-B canvas)

| Source | Notes |
|---|---|
| [draw.io · GitHub repo (jgraph/drawio)](https://github.com/jgraph/drawio) | Apache-2.0, client-side JS editor |
| [draw.io · embed-mode FAQ](https://www.drawio.com/doc/faq/embed-mode) | iframe + `embed=1` + `postMessage` protocol |
| [draw.io · configure-diagram-editor](https://www.drawio.com/doc/faq/configure-diagram-editor) | `configure=1` for host-injected fonts/palette/libraries |
| [embed.diagrams.net (lightbox sample)](https://embed.diagrams.net/?lightbox=1&edit=_blank) | The actual iframe endpoint |
| [draw.io · integration examples](https://github.com/jgraph/drawio-integration) | Reference postMessage flows |
| [`embed-drawio` npm package](https://www.npmjs.com/package/embed-drawio) | Lightweight DiagramEditor / DiagramViewer wrapper |
| [Plotly · react-chart-editor](https://github.com/plotly/react-chart-editor) | MIT, `<PlotlyEditor/>` React component (reference for our SpecDrawer UI) |
| [Vega Editor](https://vega.github.io/editor/) | Live spec editor; sets the "spec-as-source-of-truth" pattern |

## 4 · Typography / fonts

| Font | Source | Where used |
|---|---|---|
| Fraunces (display, with WONK axis) | [Google Fonts · Fraunces](https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,WONK@0,9..144,300..900,0..1;1,9..144,400..900,0..1) | Hero titles · narrative band lead · 流 easter egg · the `U` in the LIULIAN wordmark |
| JetBrains Mono (mono) | [Google Fonts · JetBrains Mono](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600) | Run header · numbers · `<kbd>` · panel headers |
| Switzer (body sans) | [Fontshare · Switzer](https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap) | Body prose · UI labels |

## 5 · Reference platforms (deep-dive in `REFERENCE_DESIGNS.md`)

Twelve platforms studied across §A–F of [`REFERENCE_DESIGNS.md`](REFERENCE_DESIGNS.md).
External landing pages and source repos for each:

### A · Time-series / ML cores

| Platform | Link |
|---|---|
| Time-Series-Library (THU-ML) | [github.com/thuml/Time-Series-Library](https://github.com/thuml/Time-Series-Library) |
| Chronos / Chronos-2 (Amazon Science) | [github.com/amazon-science (forecast page)](https://github.com/amazon-science/chronos-forecasting) |
| GluonTS (AWS Labs) | [github.com/awslabs/gluonts](https://github.com/awslabs/gluonts) |
| pytorch-forecasting | [github.com/sktime/pytorch-forecasting](https://github.com/sktime/pytorch-forecasting) |
| TSL — torch-spatiotemporal | [github.com/TorchSpatiotemporal/tsl](https://github.com/TorchSpatiotemporal/tsl) |
| tslearn | [github.com/tslearn-team/tslearn](https://github.com/tslearn-team/tslearn) |

### B · ML platforms (experiment ops)

| Platform | Link | Docs |
|---|---|---|
| ClearML | [clear.ml](https://clear.ml/) | [clear.ml/docs/latest](https://clear.ml/docs/latest/docs/) |
| MLflow | [mlflow.org](https://mlflow.org/) | [mlflow.org/docs/latest/ml](https://mlflow.org/docs/latest/ml/) |
| Weights & Biases | [wandb.ai](https://wandb.ai/) | – |
| Ultralytics HUB | [hub.ultralytics.com](https://hub.ultralytics.com/) | – |

### C · BI references

| Platform | Link |
|---|---|
| FineBI (FanRuan) | [finebi.com](https://www.finebi.com/) |
| Power BI custom visual (lucazav) | [github.com/lucazav/power-bi-time-series-custom-visual](https://github.com/lucazav/power-bi-time-series-custom-visual) |
| Tremor.so | [tremor.so](https://www.tremor.so/) |

### D · Time-series infrastructure

| Platform | Link |
|---|---|
| TDengine (taosdata) | [github.com/taosdata/TDengine](https://github.com/taosdata/TDengine) · [docs](https://docs.tdengine.com/) |

### E · Domain SaaS

| Platform | Link |
|---|---|
| HydroForecast (Upstream Tech) | [hydroforecast.com](https://www.upstream.tech/products/hydroforecast) |
| k-dense.ai | [k-dense.ai](https://k-dense.ai/) |
| Datadog (alerting reference) | [datadoghq.com](https://www.datadoghq.com/) |

### F · Frontend / monorepo

| Platform | Link |
|---|---|
| T3 Stack | [create.t3.gg](https://create.t3.gg/) |
| next-forge | [next-forge.com](https://www.next-forge.com/) |
| Saasfly | [saasfly.io](https://saasfly.io/) |
| turborepo-shadcn | [github.com/dan5py/turborepo-shadcn-ui](https://github.com/dan5py/turborepo-shadcn-ui) |

## 6 · Datasets the platform reads

| Dataset | Source / link |
|---|---|
| swiss-river-1990 / swiss-river-2010 | [github.com/swiss-river-network-benchmark (in-tree at `refer_projects/`)](refer_projects/swiss-river-network-benchmark) (local mirror; CSVs at `dataset/swiss_river/`) |
| Electricity Load (UCI) | [archive.ics.uci.edu](https://archive.ics.uci.edu/ml/datasets/ElectricityLoadDiagrams20112014) |
| ETT (Electricity Transformer Temperature) | [github.com/zhouhaoyi/ETDataset](https://github.com/zhouhaoyi/ETDataset) |
| PEMS-Bay traffic | [pems.dot.ca.gov](http://pems.dot.ca.gov/) |
| Weather (MPI Jena) | [bgc-jena.mpg.de/wetter](https://www.bgc-jena.mpg.de/wetter/) |

## 7 · Research — papers and model implementations

Detailed model-by-model notes live under
[`docs/research/entity-id-deep/`](../research/entity-id-deep/) — each
file in that folder includes the original arxiv paper link and the
reference implementation URL. Headline entries (linked elsewhere in
this doc):

| Model family | Paper / repo |
|---|---|
| PatchTST | [arxiv.org/abs/2211.14730](https://arxiv.org/abs/2211.14730) · [thuml/Time-Series-Library · PatchTST.py](https://github.com/thuml/Time-Series-Library/blob/main/models/PatchTST.py) |
| iTransformer | [arxiv.org/abs/2310.06625](https://arxiv.org/abs/2310.06625) · [thuml/iTransformer](https://github.com/thuml/iTransformer) |
| TimesNet | [arxiv.org/abs/2210.02186](https://arxiv.org/abs/2210.02186) · [thuml/Time-Series-Library · TimesNet.py](https://github.com/thuml/Time-Series-Library/blob/main/models/TimesNet.py) |
| DLinear | [arxiv.org/abs/2205.13504](https://arxiv.org/abs/2205.13504) · [cure-lab/LTSF-Linear](https://github.com/cure-lab/LTSF-Linear) |
| Mamba | [arxiv.org/abs/2312.00752](https://arxiv.org/abs/2312.00752) · [state-spaces/mamba](https://github.com/state-spaces/mamba) |
| Chronos-2 | (Amazon Science blog) · [github.com/amazon-science/chronos-forecasting](https://github.com/amazon-science/chronos-forecasting) |
| TimeMoE | [huggingface · TimeMoE-50M](https://huggingface.co/Maple728/TimeMoE-50M) |
| Time-LLM | [arxiv.org/abs/2310.01728](https://arxiv.org/abs/2310.01728) · [KimMeen/Time-LLM](https://github.com/KimMeen/Time-LLM) |
| ETSformer | [arxiv.org/abs/2202.01381](https://arxiv.org/abs/2202.01381) · [salesforce/ETSformer](https://github.com/salesforce/ETSformer) |
| Awesome-TimeSeries-SpatioTemporal-LM-LLM (curated list) | [github.com/qingsongedu/...](https://github.com/qingsongedu/Awesome-TimeSeries-SpatioTemporal-LM-LLM) |

## 8 · Cluster / HPC (UBELIX)

| Source | Notes |
|---|---|
| [UBELIX run-jobs partitions docs](https://hpc-unibe-ch.github.io/runjobs/partitions/) | Partition table · gratis / paygo limits |
| [UBELIX costs overview](https://hpc-unibe-ch.github.io/costs/overview/) | Tier pricing |
| [UBELIX status dashboard](https://www.ubelix.hpc.unibe.ch/d/a59586dd-c004-4cb7-ab5a-fd27ec7489789/ubelix-status-dashboard) | Live cluster state |
| [University of Bern HPC service page (DE)](https://intern.unibe.ch/dienstleistungen/informatik/dienstleistungen_der_informatikdienste/dienstleistungen___ressourcen/high_performance_computing___hpc___grid/index_ger.html) | Official service catalog |

## 9 · Frontend UI / animation / icons (resource bank)

When designing or implementing a UI surface, these are the pre-vetted
component / motion / icon resources. License + install command listed so
they can drop straight into a project.

### 9.1 React component libraries

| Resource | License | Install |
|---|---|---|
| [Chakra UI · github.com/chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui) — accessible, themeable React component system | MIT | `npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion` |

### 9.2 Animation / motion libraries

| Resource | License | Install / notes |
|---|---|---|
| [anime.js · github.com/juliangarnier/anime](https://github.com/juliangarnier/anime) — lightweight JS animation engine for CSS / SVG / DOM / JS objects | MIT | `npm i animejs` |
| [Three.js · github.com/mrdoob/three.js](https://github.com/mrdoob/three.js/) — 3D / WebGL library for animated scenes, geometry, particles | MIT | `npm i three` |
| [HyperFrames · github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) — "Write HTML, render video" — HTML → MP4 pipeline, designed for AI agents | Apache-2.0 | `npx hyperframes init my-video` |
| [useanimations.com](https://useanimations.com/) — micro-interaction Lottie / SVG animations, free + paid tiers | (per asset) | download SVG/JSON per icon |
| [React Native Animated · reactnative.dev/docs/animated](https://reactnative.dev/docs/animated) — declarative animation API for RN mobile apps | MIT | bundled with React Native |
| [itshover · github.com/itshover/itshover](https://github.com/itshover/itshover) — animated icon library (React + Motion); designed to move "with intent, not decoration" | – | `npx shadcn@latest add https://itshover.com/r/[icon-name].json` · demo at [itshover.com/icons](https://itshover.com/icons) |
| [math-curve-loaders · github.com/Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) — rose curve / Lissajous / cardioid loading spinners, HTML+CSS+JS, no deps | – | demo at [paidax01.github.io/math-curve-loaders](https://paidax01.github.io/math-curve-loaders/) |

### 9.3 Icons & SVG assets

| Resource | License | Notes |
|---|---|---|
| [Lucide · github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide) — open-source consistent icon set (Feather fork), 1 000+ icons | ISC | `npm i lucide-react` (also `lucide`, `lucide-vue-next`, etc.) · [lucide.dev](https://lucide.dev/) |
| [yesicon.app](https://yesicon.app/) — large multi-pack icon explorer with one-click copy SVG / JSX / CDN | (per pack) | browse only — no install |
| [svgl.app](https://svgl.app/) — repository of brand & logo SVGs for products, frameworks, tools | (varies) | browse + download per logo |

### 9.4 AI-coding spec / scaffolding

| Resource | License | Install |
|---|---|---|
| [OpenSpec · github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) — spec-driven workflow so humans + AI agree on the spec before code is generated | MIT | `npm i -g @fission-ai/openspec` then `openspec init` |

### 9.5 Creative-coding / generative-art references

These are *example projects*, not libraries — read for the technique
(rendering, asset design, isometric layouts) rather than the install.

| Resource | License | Stack / demo |
|---|---|---|
| [Mykonos Island Voxels · github.com/boona13/mykonos-island-voxels](https://github.com/boona13/mykonos-island-voxels) — browser-based isometric island builder, 14×14 grid, 75+ Mediterranean-styled assets | MIT | vanilla JS ES modules + Canvas 2D (no bundler, no framework) · live demo at [mykonos-island-voxels.netlify.app](https://mykonos-island-voxels.netlify.app) · run locally with `python3 -m http.server 8000` then open `index.html` |

## 10 · LIULIAN's own deploy targets (operational, not strictly "references")

| URL | What it points to |
|---|---|
| <http://localhost:3000/forecast> | local web (next-dev) |
| <http://localhost:8000/api/docs> | local API swagger |
| <http://localhost:3000/studio> | local studio (dataset / experiment ops) |
| `https://liulian-web.vercel.app/forecast` | deployed web (when live) |
| `https://liulian-api.up.railway.app/healthz` | deployed API healthz (when live) |

## How to extend

When you add a new external reference to any strategy or redesign doc:

1. Add a row in the matching section here with `[Title](URL)` and a
   one-line description.
2. Cite this file from the consuming doc (the consuming doc can stay
   terse — the deep link lives here).
3. If the source is paywalled, note it in the description.

Sources listed here are accurate to the date in the frontmatter; if a
URL 404s, mark it `[archived: <wayback URL>]` rather than deleting.
