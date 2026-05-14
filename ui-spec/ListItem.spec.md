# LiulianListItem

A single row in a list. Used for station lists, alert feeds, settings menus, file browsers.

**Reference:** `refs/ListItem.reference.png` (variants stacked)

---

## Anatomy

| Property | Token | Value |
|---|---|---|
| Min height | `control.height.lg` | 48 |
| Padding (horizontal) | `spacing.s4` | 16 |
| Padding (vertical) | `spacing.s3` | 12 |
| Background | `color.surface.pure` (when in a Card) or transparent (when in a flat list) | — |
| Divider (between items) | 1px `color.hairline`, full-bleed within container | — |
| Leading icon size | `control.iconSize.md` | 16 |
| Leading icon gap | `spacing.s3` | 12 |
| Trailing icon size | `control.iconSize.md` | 16 |
| Trailing icon gap | `spacing.s3` | 12 |
| Primary label | `LiulianText body` | inherits |
| Secondary label | `LiulianText caption` color `ink.muted` | inherits |
| Stack gap (primary→secondary) | `spacing.s1` | 4 |

### Composition

```
┌─────────────────────────────────────────────────────────────┐
│  [icon]  Primary label                       [trail-icon]   │
│           Secondary label (optional, lower)                  │
└─────────────────────────────────────────────────────────────┘
                          divider
┌─────────────────────────────────────────────────────────────┐
│  [icon]  Primary label                       [trail-icon]   │
│           Secondary label                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Variants

### navigation
- Trailing icon: chevron-right (forwarding affordance)
- Interactive: tap navigates to detail view
- Triggers `onPress`

### content
- No trailing icon
- Non-interactive by default
- Used for read-only lists

### selectable
- Trailing icon: check (when selected) or empty circle (when not)
- Interactive: tap toggles selection
- Triggers `onSelect`

### multiSelectable
- Like selectable but check is a square (checkbox visual) for visual distinction
- Allow multiple selected items
- Triggers `onSelect`

---

## States

### rest
Default per variant.

### hover (interactive only)
- Background: `color.canvas.warm`
- No translateY (list items don't lift)

### active (press)
- Background: `color.hairline` (slightly darker than hover)
- Duration: `motion.duration-instant`

### focus (keyboard)
- Outline: 2px `color.unibe-red` offset -2px (inset within row)
- Maintains a11y; visible focus required

### selected (selectable variants)
- Background: `color.unibe-red.tint`
- Trailing check icon visible

### disabled
- Opacity: `opacity.disabled`
- No hover, no press

---

## Motion

| Transition | Token |
|---|---|
| Background color change (hover, active) | `motion.duration-fast = 180ms` linear |
| Selection check icon appear | `motion.duration-instant = 80ms` + `motion.ease-out-quart`, opacity + scale 0.9→1 |

---

## Accessibility (WCAG 2.2 AA)

- **Role**: 
  - `navigation` variant → `<a>` (web) / `button` (mobile)
  - `selectable` variant → `<button role="option">` (web) / button (mobile) with `aria-selected`
  - `multiSelectable` → `<input type="checkbox">` semantics
  - `content` → `<li>` only, no interactive role
- **Touch target**: min-height 48 covers Android+Harmony spec; iOS gets 44pt minimum via min-height (we use 48, which exceeds iOS too)
- **Long-press**: not handled by default. Add a `onLongPress` prop only when needed (e.g. context menu).
- **Screen reader announcement**: 
  - "Aare-Bern station, water level 142 cm. Navigate" (for navigation)
  - "Aare-Bern station, selected" / "not selected" (for selectable)
- **Contrast**: same as Text.spec — body + caption colors verified.

---

## Props

```typescript
interface LiulianListItemProps {
  variant?: 'navigation' | 'content' | 'selectable' | 'multiSelectable';  // default: 'content'
  leadingIcon?: IconRef;
  primary: string;                          // primary label
  secondary?: string;                       // optional secondary
  trailing?: ReactNode;                     // override default trailing icon (e.g. badge, timestamp)
  selected?: boolean;                       // for selectable / multiSelectable variants
  disabled?: boolean;
  onPress?: () => void;                     // for navigation
  onSelect?: (selected: boolean) => void;   // for selectable variants
  ariaLabel?: string;
}
```

---

## Implementation notes

### iOS (SwiftUI)
- Wrap in `Button` for tappability; render content via `HStack { icon + VStack { primary + secondary } + Spacer + trailing }`
- `.buttonStyle(LiulianListItemButtonStyle())` to override system highlight
- Divider via `Divider().background(LiulianTokens.Colors.hairline).padding(.leading, 48)` (indent past leading icon area)

### Android (Compose)
- `Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().clickable(...))`
- `Column` for primary+secondary stack
- Divider as `HorizontalDivider(thickness = 1.dp, color = ...)` between items via `LazyColumn`

### HarmonyOS (ArkUI)
- `Row() { ... }.height(...).onClick(() => {})` + `.stateStyles({...})` for hover/press
- Use ArkUI `List` component for the parent; supply divider via `.divider({...})`

### Web (React)
- `<li>` for content; `<button>` or `<a>` wrapped in `<li role="presentation">` for interactive
- Tailwind utilities + tokens; dividers via `border-b border-hairline` on items except last

---

## What this spec rules out

- ❌ Heavy hover background changes (only hairline color, not full canvas)
- ❌ Avatar/image circle replacements for the leading icon at default size (icon stays at 16px even when content suggests larger imagery)
- ❌ Multiple trailing actions stacked (use a single trailing slot, or move actions to a swipe gesture on mobile)
- ❌ Swipe-to-reveal actions in v1 (defer to later spec when we have a real product need)
