# Design + validation plugin / tool stack

Curated set of plugins and tools used in the LIULIAN design system + native app workflows.

## Design tools (Figma side)

### Token sync
| Plugin | What | Why we picked it |
|---|---|---|
| **Tokens Studio for Figma** | W3C DTCG token sync with GitHub | Industry standard for spec-conformant tokens; free for individuals; GitHub-native |
| **Figma Variables Import** (native) | One-shot DTCG import | Built into Figma. Use for occasional refreshes when full sync overkill |

### Accessibility
| Plugin | What | Use case |
|---|---|---|
| **Stark** | Contrast check, color blindness simulation, ARIA annotations | Verify ui-spec contrast claims before shipping |
| **A11y Annotation Kit** | Mark up tab order, focus traps, regions on designs | Hand-off to engineering |
| **Able** | Quick contrast spot-check | When designing a single component |

### Type + spacing
| Plugin | What |
|---|---|
| **Anima** | Inspect spacing / margins / type accurately (CSS-readable measurement) |
| **Vectorize.js** | Convert pixels to em / rem when designing typography ramps |

### Component management
| Plugin | What |
|---|---|
| **Visual Inspector** | See current Figma variable assignments + spacing visually |
| **Figma Code Connect** (native, 2024+) | Link Figma components to actual code components — devs see component code while in Figma |

## Native dev validation tools

### iOS (Swift)
| Tool | What |
|---|---|
| **SwiftLint** | Style linter; we add custom rule banning raw `.padding(<number>)` calls |
| **SwiftFormat** | Auto-format Swift code |
| **Xcode SwiftUI Preview** | Live preview for individual views (incl. LiulianGallery) |
| **ios-snapshot-test-case** (Uber) | Snapshot tests, programmatic VR baseline |
| **Accessibility Inspector** (Xcode built-in) | Verify VoiceOver semantics + contrast |

### Android (Kotlin / Compose)
| Tool | What |
|---|---|
| **ktlint** | Style linter |
| **detekt** | Code-quality linter; custom rules to ban Material 3 imports outside the library wrapper |
| **Compose Preview** (Android Studio) | Live preview decorators |
| **Paparazzi** (Square) | Snapshot tests without emulator — runs on CI |
| **Shot** (Karumi) | Alternative snapshot test framework |
| **Compose Test Rule** | UI tests with semantics assertions |
| **Accessibility Scanner** (Google) | A11y audit against installed app |

### HarmonyOS (ArkTS)
| Tool | What |
|---|---|
| **DevEco Code Linter** | Built-in ESLint-style rules for ArkTS |
| **Hyperion** | HarmonyOS code quality (similar to detekt) |
| **DevEco Previewer** | Component preview |
| **Hypium** | HarmonyOS unit + UI testing framework |
| **DevEco Performance Profiler** | FPS, memory, GPU profiling |

### Web (React)
| Tool | What |
|---|---|
| **Storybook** | Component gallery + isolated dev |
| **Chromatic** | VR via cloud — diffs Storybook snapshots across commits |
| **Playwright** | E2E + screenshots for VR capture |
| **axe-core** + **axe DevTools** | A11y audit |
| **Lighthouse** | Performance + a11y + SEO |
| **pa11y** | a11y CLI for CI |
| **Polypane** | Multi-device responsive preview |

## Cross-cutting

| Tool | What |
|---|---|
| **ImageMagick** | `compare` for pixel diff in vr-diff.sh |
| **MagickWand** | Programmatic image manipulation in scripts |
| **GitHub Actions** | CI runner matrix (macOS for iOS, Linux for Android+web, Windows for HarmonyOS once we hit team scale) |
| **Lefthook / Husky** | Cross-platform pre-commit hooks (token lint) |
| **Conventional Commits** | Standard commit prefix (`feat:`, `fix:`, `style:`) for automated changelog + visual-only changes call out |

## What we deliberately don't use

| Tool | Why not |
|---|---|
| **Material Design library** (Compose / SwiftUI ports) | We baseline on Material 3 *behaviors* (touch, motion) but our visual layer is hand-crafted |
| **iOS Cupertino Compose port** | Same as above; we want LIULIAN visuals not Apple-default visuals on Android |
| **NativeScript / React Native / Flutter** | The three constraints (HarmonyOS native + best perf + pixel parity) ruled these out (see PLATFORM_BLUEPRINT) |
| **Apollo / Relay** | We use OpenAPI codegen to avoid GraphQL infrastructure for now |
| **Figma Anima Auto-Code** | Generated React/Vue from Figma is generally low-quality and we have hand-crafted code |
