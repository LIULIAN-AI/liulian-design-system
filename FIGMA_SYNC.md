# Figma sync

LIULIAN tokens flow both ways between code (`tokens.json`) and design tools (Figma, Sketch, etc.).

## Mental model

```
              tokens.json (source of truth in git)
                    │
        node scripts/build.mjs  ─────┐
                    │                 │
                    ▼                 ▼
            dist/tokens.figma.json   dist/Tokens.swift, Tokens.kt, tokens.ets, ...
                    │                          │
        Tokens Studio for Figma      consumed by 4 implementations
                    │
                    ▼
            Figma Variables in design files
                    │
        designers reference tokens (not raw values)
                    │
                    ▼
            Figma → code: designs use the same names devs use,
                    no translation needed
```

The Figma side is **read-only against tokens.json**. If a designer wants to change a token, they edit `tokens.json` in a PR.

## Setup the Figma side, one time

1. Install the **Tokens Studio for Figma** plugin (free for individuals): https://tokens.studio
2. In any LIULIAN Figma file, open Tokens Studio plugin
3. Settings → "Sync with" → choose "GitHub"
4. Connect to repo `liulian-ai/liulian-design-system`, branch `main`, file path `dist/tokens.figma.json`
5. Tokens Studio will pull the token set into Figma — tokens become available as Figma Variables

## Round-trip workflow

### Code → Figma (the only direction we use)
1. Developer edits `src/tokens.json` in `liulian-design-system`
2. Runs `node scripts/build.mjs` → regenerates `dist/tokens.figma.json` + the 10 other targets
3. Commits + pushes to main
4. In Figma, designer opens Tokens Studio → clicks "Pull from GitHub"
5. Figma Variables now reflect the new token set
6. Designer uses these via Variables panel (Local → LIULIAN tokens → color.unibe-red)

### Figma → Code (manual review only)
If a designer proposes a new token via comment / Slack:
1. Developer reads the proposal
2. Edits `src/tokens.json` (in a PR)
3. Runs build, commits, merges
4. Pull in Figma as above

**Never** sync code-side tokens FROM Figma. Figma is downstream of code.

## What's in `dist/tokens.figma.json`

W3C DTCG-compliant token format (`$value`, `$type`, `$description` fields). All 87 LIULIAN tokens:

- 31 colors (canvas, surface, ink, unibe-red, status, hairline, secondary)
- 3 font families
- 11 font sizes
- 11 spacing scale steps
- 5 border radius values
- 1 border preset
- 7 motion (durations + easings)
- 11 control sizes
- 2 focus ring values
- 3 shadow presets
- 2 opacity values
- 3 touch target presets

Total: 90 leaf entries (87 + 3 schema/comment fields).

## Plugin alternatives (if Tokens Studio not desired)

- **Figma Variables Import** (native Figma feature, since 2024) — supports W3C DTCG format. File → Import variables → upload `dist/tokens.figma.json`. One-shot import (no auto-sync), good for occasional snapshots.
- **Style Dictionary + Figma plugin** (Amazon) — for teams already using Style Dictionary. Slight overhead vs Tokens Studio for our scale.
- **Sketch + Toby plugin** — for Sketch instead of Figma. Same DTCG format works.

## Sharing the Figma library across designers

After designers pull tokens once, they should:
1. Save the LIULIAN Figma file as a **Team Library** (Library → Publish library)
2. All future Figma files import this library
3. When `tokens.figma.json` changes, only one designer pulls + republishes; everyone else's files auto-update

## Component spec PNGs (the reverse direction)

The `ui-spec/refs/*.png` files are designer-authored — they're the visual target the native implementations must match. Workflow:

1. Designer renders a component (e.g. LiulianButton primary md) in Figma at 4× scale
2. Exports as PNG (high quality, 2x or 4x resolution)
3. Drops into `liulian-design-system/ui-spec/refs/Button.reference.png`
4. PR to add or update the reference image
5. VR diff scripts use this as the target for visual regression

When tokens or anatomy values change in code, the reference PNG may go stale — designer is notified to re-render and re-export.
