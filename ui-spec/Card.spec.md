# LiulianCard

Surface container for grouping related content. Most LIULIAN surfaces (forecast cards, station tiles, alert banners) build on this.

**Reference:** `refs/Card.reference.png`

---

## Anatomy

| Property | Token | Compact | Default | Spacious |
|---|---|---|---|---|
| Padding (all sides) | `spacing.*` | s4 (16) | **s6 (24)** | s7 (32) |
| Border | 1px `color.hairline` | always | always | always |
| Border radius | `radius.md` | 10 | **10** | 10 |
| Background | `color.surface.pure` | white | **white** | white |
| Min content area | — | adaptive | adaptive | adaptive |
| Gap (between slots) | `spacing.*` | s3 (12) | **s4 (16)** | s5 (20) |

### Slot composition (all optional)

```
┌──────────────────────────────────┐
│ header   ← title, badge, action  │ ← optional, slot order locked
│ ─────────────                    │ ← divider only if header AND body both present
│ body     ← main content         │ ← optional, but card with no body is unusual
│ ─────────────                    │ ← divider only if body AND footer both present
│ footer   ← actions, meta        │ ← optional
└──────────────────────────────────┘
```

**Slot dividers**: 1px `color.hairline`, full-bleed (touch left and right edges of card padding).

---

## Variants

### static (default, non-interactive)
- No hover, no focus, no press.
- Use for read-only data displays.

### interactive
- Receives keyboard focus.
- Hover lift + shadow.
- Click activates `onPress` callback.

### selected
- Modifier on `interactive`. When `selected` prop is true:
  - Border: 2px `color.unibe-red` (replaces hairline)
  - Padding adjusted to maintain inner size (subtract 1px to compensate for border thickness change)

### danger
- Modifier on `static` or `interactive`. When `danger` prop is true:
  - Border: 1px `color.unibe-red.tint`
  - Background: linear-gradient from `color.unibe-red.tint` (top, 10% opacity) to `color.surface.pure` (rest)
  - **Exception to gradient ban**: this is a status indicator, not decoration

---

## States (interactive variant only)

### rest
Default per variant.

### hover
- Border → `color.hairline.strong`
- Transform: `translateY(-2px)`
- Shadow: `shadow.raise = 0 2px 8px rgba(19,19,19,0.04)`
- Background unchanged

### active (press)
- Transform: `translateY(0) scale(0.99)` (subtler than Button's 0.98)
- Shadow: shadow.rest
- Duration: `motion.duration-instant`

### focus (interactive only)
- Outline: 2px `color.unibe-red` offset 2px
- Same rules as Button focus ring

### disabled
- Opacity: `opacity.disabled`
- No hover, no active
- Cursor: not-allowed (web)

---

## Motion

| Transition | Token |
|---|---|
| rest ↔ hover | `motion.duration-medium = 300ms` + `motion.ease-out-quart` |
| hover → active | `motion.duration-instant = 80ms` + `motion.ease-out` |

---

## Accessibility

- **Role**: `region` (static) or `button` (interactive) or `article` (content card with header)
- **Heading**: if card has a header, it includes a heading (`h2`-`h6` per page hierarchy)
- **Focus**: interactive cards Tab-focusable; press via Enter/Space (web), tap (mobile)
- **Contrast**: white surface on warm canvas → contrast 1.02:1 (visually distinct via border, not contrast — passes a11y via 1px hairline)

---

## Props

```typescript
interface LiulianCardProps {
  variant?: 'static' | 'interactive';  // default: 'static'
  size?: 'compact' | 'default' | 'spacious';  // default: 'default'
  selected?: boolean;       // only meaningful for interactive
  danger?: boolean;
  disabled?: boolean;       // only meaningful for interactive
  header?: ReactNode | () => Composable | View;
  footer?: ReactNode | () => Composable | View;
  children: ReactNode | () => Composable | View;  // body content
  onPress?: () => void;     // required if variant=interactive
  ariaLabel?: string;       // override accessible name
}
```

---

## Implementation notes

### iOS (SwiftUI)
- Use `VStack(alignment: .leading, spacing: tokens.spacing.s4)` for slots
- Apply background + border via `.background(LiulianTokens.Colors.surfacePure).overlay(RoundedRectangle.stroke(...))`
- Interactive variant: wrap in `Button { action } label: { content }` with `.buttonStyle(LiulianCardButtonStyle())` to drive hover/press states

### Android (Compose)
- Use `Column(verticalArrangement = Arrangement.spacedBy(LiulianTokens.Spacing.s4))`
- Border via `Modifier.border(1.dp, LiulianTokens.Colors.hairline)`
- Interactive variant: `Modifier.clickable(interactionSource, indication = null)` + manual press state

### HarmonyOS (ArkUI)
- Use `Column() { ... }.borderColor(...).borderWidth(1).borderRadius(...)`
- Interactive variant: `.onClick(() => {})` + custom press animation via `.animation({...})`

### Web (React)
- `<div className="liulian-card">` with Tailwind utilities; aria attributes set conditionally on `variant`

---

## What this spec rules out

- ❌ Nested cards (impeccable absolute ban — always wrong)
- ❌ Side-stripe borders (impeccable absolute ban)
- ❌ Heavy drop shadow `shadow-md/lg/xl` (sparse shadow rule)
- ❌ Background tints other than for `danger` variant
