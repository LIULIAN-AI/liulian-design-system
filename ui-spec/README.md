# LIULIAN ui-spec

Component design contract. **One spec, four implementations** (web React, iOS SwiftUI, Android Compose, HarmonyOS ArkUI) — all must conform.

## What a spec answers

| Section | Answers |
|---|---|
| **Anatomy** | "What pixels go where?" — height, padding, icon size, gap |
| **Variants** | "How many shapes does this component come in?" — primary/secondary/etc. |
| **States** | "What does it do under interaction?" — rest/hover/active/focus/disabled/loading |
| **Motion** | "How does it animate between states?" — duration + easing per transition |
| **Accessibility** | "How does this work for keyboard/screenreader/touch?" |
| **Props** | "What's the API contract for callers?" — TypeScript-style signature |
| **Reference** | "What does the result look like?" — PNG at 4× zoom in `refs/` |

## Authoring rules

1. **Every numeric value MUST come from a token**. If you need a number that's not in `tokens.json`, add the token first, then reference it. Never use raw numbers like `padding: 12px` directly in a spec.
2. **Anatomy values are pixels**. Implementations convert per platform (Swift `CGFloat`, Compose `dp`, ArkUI `vp`, CSS `px`).
3. **States are exhaustive**. Every interactive state combination must be specified (e.g. `disabled + hover` = inherits `disabled` styling).
4. **Motion is named**. Use `motion.ease-out-quart 180ms` not `cubic-bezier(0.16, 1, 0.3, 1) 0.18s`.
5. **Accessibility is non-negotiable**. Every spec must list WCAG-2.2-AA conformance: contrast ratios, focus visibility, touch target ≥ 44pt (iOS) / 48dp (Android+HMR).

## Component baseline strategy

Build on platform standards' **interaction baselines**, override **visual layer**:

| Platform | Interaction baseline (use it) | Visual layer (override it) |
|---|---|---|
| iOS | Apple HIG (focus, dynamic type, dark mode toggle, system haptics) | Don't use `UIButton` default, draw via SwiftUI primitives |
| Android | Material 3 (touch ripple semantics, motion durations, gesture nav) | Don't use Material `Button`, build via Compose Foundation |
| HarmonyOS | HMS Design (system haptics, dark mode token, multi-form factor) | Don't use ArkUI `Button` default, draw via Canvas/Stack |
| Web | Radix UI primitives (focus management, ARIA, keyboard nav) | Tailwind + token-driven custom |

## Files

| File | Component |
|---|---|
| [Button.spec.md](Button.spec.md) | Primary interactive control |
| [Card.spec.md](Card.spec.md) | Surface container |
| [Input.spec.md](Input.spec.md) | Text entry |
| [Text.spec.md](Text.spec.md) | Type renderer (display/heading/body/caption/mono) |
| [Tab.spec.md](Tab.spec.md) | Segmented navigation |
| [ListItem.spec.md](ListItem.spec.md) | List row with optional leading/trailing affordance |

## Verification

Implementations are checked against specs by:

1. **Token lint** (git pre-commit hook in each native repo) — no raw numbers in style code, must reference token
2. **Gallery screenshots** — each platform renders `LiulianGallery` view with all variants × states; PNG saved to `vr-baseline/{platform}/`
3. **4-grid VR diff** — `vr-diff.sh` produces side-by-side comparison of web / iOS / Android / HarmonyOS for each component
4. **Reviewer pass** — one human (you) reviews every UI PR's 4-grid before merge

See [../VR_TESTING.md](../VR_TESTING.md) for the full visual regression workflow.
