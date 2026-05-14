# LiulianText

Type renderer. Maps semantic role to font family + size + weight + line-height + letter-spacing. **Always use LiulianText for any visible text** — never style `<Text>` / `<p>` / `Text(...)` directly.

**Reference:** `refs/Text.reference.png` (all 9 variants stacked)

---

## Variants

Each variant resolves to a fixed bundle of typographic properties.

| Variant | Font | Size | Weight | Line height | Letter spacing | Use for |
|---|---|---|---|---|---|---|
| `display` | Fraunces (italic alt U via WONK axis) | `fontSize.6xl` (96) | 500 | 0.95 | -0.04em | Hero headlines on landing |
| `displayShort` | Fraunces | `fontSize.5xl` (56) | 500 | 0.98 | -0.035em | Page-level page title |
| `heading` | Fraunces | `fontSize.4xl` (38) | 500 | 1.05 | -0.025em | Section heading |
| `title` | Fraunces | `fontSize.3xl` (28) | 500 | 1.12 | -0.02em | Sub-section / card title |
| `subtitle` | Switzer | `fontSize.xl` (18) | 500 | 1.35 | -0.01em | Within-card lead |
| `body` | Switzer | `fontSize.md` (13.5) | 400 | 1.55 | normal | Default paragraph |
| `bodyStrong` | Switzer | `fontSize.md` (13.5) | 500 | 1.55 | normal | Emphasis within body |
| `caption` | Switzer | `fontSize.xs` (10.5) | 400 | 1.45 | normal | Meta info |
| `monoLabel` | JetBrains Mono | `fontSize.xs` (10.5) | 500 | 1.4 | 0.10em uppercase | Pretitle / overline / system meta |

---

## Anatomy

There is no padding/margin — Text components don't include spacing. Layout is the parent's job.

**Color**: defaults to `color.ink.charcoal`. Override via `color` prop. Common overrides:
- `color.ink.muted` for de-emphasis
- `color.ink.faint` for very de-emphasized meta
- `color.unibe-red.text` for danger/error meta
- `color.unibe-red` for brand spot color (display variant only, sparingly)

---

## Special rules

### Italic alt-U (brand mark)
The string `"U"` inside `display` and `displayShort` variants, when on its own (e.g. as a single character within a larger word like "LIULIAN"), should render with:
- `font-style: italic`
- `font-variation-settings: "WONK" 1, "wght" 600`
- `color: color.unibe-red`

This is the LIULIAN brand mark. Implementations expose a `<LiulianText.WonkU />` helper or accept a `wonkU` mode.

### Numerical tabular figures
For data displays (forecast tables, station IDs):
- `font-variant-numeric: tabular-nums`
- This is the default when `font.body` (Switzer) is used at `fontSize.md` or smaller.

### Dynamic Type (iOS) + scalable text (Android/Harmony)
- Mobile platforms support OS-level text scaling.
- LIULIAN respects this via scaling our font sizes proportional to the user's preference, **but** caps at 1.3× to preserve layout integrity.
- Web: respect `rem` units which honor browser font-size setting.

---

## Motion

Text variants don't animate by themselves. Animation is the responsibility of containing components (e.g. Card slide-in includes its Text children).

---

## Accessibility (WCAG 2.2 AA)

- **Contrast**: every variant + color combo verified at `vr-baseline/contrast.json`:
  - charcoal on warm-canvas: 17.0:1 ✓ AAA
  - muted on warm-canvas: 7.6:1 ✓ AAA
  - faint on warm-canvas: 4.5:1 ✓ AA (borderline; never use for body, only meta)
- **Semantic heading levels**: callers must supply `as={'h1' | 'h2' | ... | 'h6' | 'p' | 'span'}` (web) or set proper a11y semantics (mobile). LiulianText does NOT auto-infer heading level from variant.
- **Reading order**: matches DOM/view order; no positioning tricks.

---

## Props

```typescript
type Variant =
  | 'display' | 'displayShort'
  | 'heading' | 'title' | 'subtitle'
  | 'body' | 'bodyStrong'
  | 'caption' | 'monoLabel';

interface LiulianTextProps {
  variant?: Variant;                                     // default: 'body'
  color?: TokenColorRef | string;                        // default: 'ink.charcoal'
  as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'div';   // web only; default: from variant
  wonkU?: boolean;                                       // enable italic alt-U treatment
  align?: 'left' | 'center' | 'right';                   // default: 'left'
  truncate?: boolean | number;                           // ellipsis after N lines (web/iOS/Android support 1+; harmony 1 only)
  children: ReactNode | string;
}
```

---

## Implementation notes

### iOS (SwiftUI)
- Use `Text(...)` with `.font(.custom(LiulianTokens.Fonts.display, size: LiulianTokens.FontSize.xl6))`
- Apply `.kerning(value)` for letter-spacing
- Apply `.lineSpacing(value)` for line-height (note: SwiftUI lineSpacing is ADDITIONAL to font's baseline; compute correctly)
- Variation axis access (WONK for Fraunces): requires custom `UIFont` with `fontDescriptor` variation dict

### Android (Compose)
- Use `Text(...)` with `style = TextStyle(fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)`
- For Fraunces variable axes (WONK, opsz): load via `FontVariation.Settings(...)` (Compose 1.6+)

### HarmonyOS (ArkUI)
- Use `Text(...)` with `.fontFamily(LiulianTokens.Fonts.display)`
- ArkUI has limited variable-font axis support; fall back to fixed-weight Fraunces.italic + manual color for WonkU

### Web (React)
- Tailwind classes from preset; Fraunces variation via `font-variation-settings` inline style for WonkU mode

---

## What this spec rules out

- ❌ Inline color/size styling — always use a Text variant or a documented color override
- ❌ Drop-cap effects (impeccable-style decorative typography is for landing prose only, separate component)
- ❌ Text shadow / glow effects
- ❌ Bold body text (use `bodyStrong` variant — weight 500 is the max in body)
