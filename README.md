# @liulian/design-system

The single source of truth for LIULIAN's design language.

One repo, two artefact families:

1. **`tokens`** — atomic values (color, spacing, type, motion). Generated outputs in `dist/`.
2. **`ui-spec`** — component design contracts in `ui-spec/`. Implementations live per platform.

```
liulian-design-system/
├── src/tokens.json              ← edit this. SINGLE SOURCE OF TRUTH for atoms.
├── ui-spec/*.spec.md            ← edit this. SINGLE SOURCE OF TRUTH for components.
├── scripts/build.mjs            ← regenerates dist/ from src/tokens.json
├── dist/                        ← generated. DO NOT EDIT.
│   ├── tokens.css               (web — CSS custom properties)
│   ├── tokens.mjs, .js, .d.ts   (web — JS / TS)
│   ├── tailwind.preset.js       (web — Tailwind preset)
│   ├── antd-theme.js            (web — Ant Design config)
│   ├── tokens.rn.js             (legacy — React Native; not actively consumed)
│   ├── Tokens.swift             (iOS — SwiftUI)
│   ├── Tokens.kt                (Android — Jetpack Compose)
│   ├── tokens.ets               (HarmonyOS — ArkTS)
│   └── tokens.figma.json        (Figma — Tokens Studio import, W3C DTCG)
├── FIGMA_SYNC.md                ← Figma round-trip workflow
├── VR_TESTING.md                ← visual regression across 4 platforms
└── PLUGINS.md                   ← validation tools per platform
```

## What's the difference between `tokens` and `ui`?

**`tokens`** = "what colors / sizes / curves does LIULIAN use?" — atomic, platform-agnostic, single value per slot.

**`ui`** = "what does a LIULIAN Button look like?" — anatomy + variants + states + behaviors + a11y. Composes from tokens.

| Thing | Layer | Why |
|---|---|---|
| `#E20613` UniBe red hex | tokens | single value |
| `Fraunces` font name | tokens | single value |
| `40px` (button height md) | tokens (as `control.height.md`) | single value |
| `cubic-bezier(0.16, 1, 0.3, 1)` | tokens (as `motion.ease-out-quart`) | single curve |
| Button is 40px tall, has 4 variants, lifts -1px on hover | ui (anatomy + variants + motion) | multi-value spec |
| Card has header/body/footer slots, hairline border, 24px padding | ui (composition + variants) | spec |

**Boundary test**: "Can it be a single value in a JSON file?" → tokens. Otherwise → ui.

## Brand at a glance

- **Anchor color**: UniBe red `#E20613` (spot only; max 2 visible per viewport on most pages)
- **Canvas**: warm bone `#FBFBFA` (never `#fff`)
- **Ink**: charcoal `#131313` (never `#000`)
- **Display**: Fraunces (variable, op-size 9..144, WONK 0..1 for the italic alt-U brand mark)
- **Body**: Switzer (Fontshare)
- **Mono**: JetBrains Mono (tabular numerals)

See `../liulian-python/docs/strategy/PLATFORM_DESIGN.md §2` for the full rationale.

## Build

```bash
node scripts/build.mjs        # one-shot
node scripts/build.mjs --watch  # rebuild on tokens.json change
```

Produces 11 files in `dist/`. 87 tokens.

## Consumers

| Consumer | How it loads tokens |
|---|---|
| **liulian-web** | `@liulian/design-tokens` npm package (local file dep in monorepo) |
| **liulian-mobile/ios** | `cp dist/Tokens.swift ios/LiulianUI/Sources/LiulianUI/Tokens.swift` (via `shared/scripts/sync-tokens.sh`) |
| **liulian-mobile/android** | `cp dist/Tokens.kt android/liulian-ui/src/main/kotlin/io/liulian/ui/Tokens.kt` |
| **liulian-mobile/harmony** | `cp dist/tokens.ets harmony/liulian_ui/src/main/ets/components/tokens.ets` |
| **Figma** | Tokens Studio plugin reads `dist/tokens.figma.json` from GitHub |

## Web install (legacy npm package mode)

```bash
pnpm add @liulian/design-tokens
```

```tsx
// Tailwind preset
import liulianPreset from '@liulian/design-tokens/tailwind';
export default { presets: [liulianPreset], content: [...] };

// CSS variables
import '@liulian/design-tokens/css';
.button-primary { background: var(--color-unibe-red); }

// TypeScript
import { tokens } from '@liulian/design-tokens';
console.log(tokens['color.unibe-red']);  // "#E20613"

// Ant Design
import antdTheme from '@liulian/design-tokens/antd-theme';
<ConfigProvider theme={antdTheme}>...</ConfigProvider>
```

## Native install (mobile)

```bash
# In liulian-mobile/, after pulling latest design-system:
bash shared/scripts/sync-tokens.sh
# Copies Tokens.swift / Tokens.kt / tokens.ets into each platform's UI module.
```

## ui-spec authoring

Each `ui-spec/*.spec.md` defines a component:
- Anatomy table (height, padding, icon size — all token-referenced)
- Variants (e.g. primary / secondary / ghost / danger)
- States (rest / hover / active / focus / disabled / loading)
- Motion (duration + easing per transition)
- Accessibility (WCAG 2.2 AA contract)
- Props (canonical TypeScript-style signature mirrored on all platforms)

When updating a spec:
1. Edit the `.spec.md`
2. Update each platform's implementation
3. Capture VR baseline on all four platforms (see VR_TESTING.md)
4. PR includes spec + 4 implementations + 4-grid VR PNG

## Versioning

Semver. Tokens / specs that change visible output → minor bump. Renames / removals → major.

`0.1.0` is current.

## License

MIT.
