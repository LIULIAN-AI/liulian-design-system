# Visual regression testing

LIULIAN's "pixel-level consistency" promise across web + iOS + Android + HarmonyOS is **engineered**, not given by a framework. This document is the engineering plan.

## What we're checking

Given a component (e.g. `LiulianButton primary md rest`):
- Web rendering (Chrome / Safari / Firefox at 1× DPI)
- iOS rendering (iPhone 15 Pro Simulator)
- Android rendering (Pixel 8 emulator API 34)
- HarmonyOS rendering (Mate 60 NEXT emulator API 12)

**Target**: 95%+ pixel-similarity (eyeball-level identical at 1×, only visible at 4× zoom under careful inspection).

**Not a target**: byte-identical PNG. Engine antialiasing differences are physically unavoidable.

## The 4-grid workflow

For every UI PR (web or any native), produce a 4-grid PNG showing the affected component on all 4 platforms.

```
┌────────────┬────────────┐
│            │            │
│   Web      │   iOS      │
│            │            │
├────────────┼────────────┤
│            │            │
│  Android   │ HarmonyOS  │
│            │            │
└────────────┴────────────┘
```

The 4-grid is committed to the PR; reviewer scans for visual drift.

## Per-platform capture

| Platform | Tool | Output |
|---|---|---|
| Web | Playwright + screenshot of `/__gallery` page | `liulian-mobile/shared/refs/web-Gallery.png` |
| iOS | Xcode SwiftUI Preview → export image | `liulian-mobile/shared/refs/ios-Gallery.png` |
| Android | Compose Preview export OR Paparazzi snapshot test | `liulian-mobile/shared/refs/android-Gallery.png` |
| HarmonyOS | DevEco preview export OR `previewer` CLI | `liulian-mobile/shared/refs/harmony-Gallery.png` |

## Capture scripts (in liulian-mobile)

```bash
cd liulian-mobile

# 1. Capture all four (each platform must have its IDE running, or use CLI tools)
bash shared/scripts/vr-capture.sh

# 2. Generate 4-grid
bash shared/scripts/vr-diff.sh

# Outputs:
# - shared/refs/4grid-Gallery.png (the side-by-side)
# - shared/refs/diff-Gallery-{ios-vs-web,android-vs-ios,harmony-vs-android}.png
# - shared/refs/report.html (browser-viewable summary)
```

Note: `vr-capture.sh` requires:
- macOS for iOS capture (Xcode + simctl)
- Android emulator running (`emulator` from Android SDK)
- HarmonyOS emulator running (DevEco previewer CLI)
- Chrome/Firefox installed for web capture (via Playwright)

For solo development, run only the platform(s) you've changed. Aim for full 4-grid before any UI release.

## Per-component capture (focused diffs)

Sometimes Gallery as a whole is too noisy. Per-component:

```bash
bash shared/scripts/vr-diff.sh Button
# Captures only the Button variants × states on each platform.
# Useful for narrow regressions.
```

## What counts as "drift"

| Difference | Verdict |
|---|---|
| ≤ 2% pixels different (ImageMagick `compare -metric AE -fuzz 2%`) | ✅ pass — engine antialiasing |
| 2–5% pixels different | ⚠️ borderline — inspect manually |
| > 5% pixels different | ❌ fail — investigate |
| Different colors (any hex difference) | ❌ fail — token drift |
| Different sizes / spacing | ❌ fail — anatomy drift |
| Different fonts (visible character shapes) | ❌ fail — font registration issue |

## Token lint (separate, complementary check)

Per `ui-spec/README.md`, no raw numbers allowed in styling code. A pre-commit hook in each platform verifies:

```bash
# iOS hook
git diff --cached --name-only | grep '\.swift$' | xargs grep -nE 'padding\([0-9.]+\)|\.fontSize\([0-9.]+\)|CGFloat\([0-9]+\)' \
  && echo "ERROR: raw numeric values in style code. Use LiulianTokens." && exit 1

# Android hook  
git diff --cached --name-only | grep '\.kt$' | xargs grep -nE '\.padding\([0-9]+\.dp\)|fontSize\s*=\s*[0-9]+' \
  && echo "ERROR: raw .dp / fontSize literals. Use LiulianTokens." && exit 1

# HarmonyOS hook
git diff --cached --name-only | grep '\.ets$' | xargs grep -nE '\.fontSize\([0-9]+\)|\.padding\([0-9]+\)|\.borderRadius\([0-9]+\)' \
  && echo "ERROR: raw numeric values. Use Spacing/Radius/FontSize tokens." && exit 1
```

These run before the VR check. Token lint fires before code reviewers see a PR — VR is the second gate.

## Future automation

Once the team grows:
- CI matrix: macOS runner for iOS, Linux for Android+web, Windows for HarmonyOS
- Each PR triggers VR capture + 4-grid generation
- Diff posted as PR comment
- Block merge if VR delta > 5% pixels

For now (solo developer): run VR locally, eyeball, ship.
