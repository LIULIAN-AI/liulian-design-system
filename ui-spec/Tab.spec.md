# LiulianTab

Segmented horizontal navigation. Used for in-page section switching (Forecast / Studio / Mobile in /web-demo, or Home / Forecast / Alerts in mobile app).

**Reference:** `refs/Tab.reference.png` (showing 3 tabs, middle one active, hover state on first)

---

## Anatomy

### Tab bar (container)

| Property | Token | Value |
|---|---|---|
| Height | `control.height.md` | 40 |
| Background | `color.canvas.warm` | — |
| Border bottom | 1px `color.hairline` | — |
| Padding (horizontal, container) | `spacing.s6` | 24 |
| Alignment | left (LIULIAN editorial) or center (mobile app) | — |

### Tab item

| Property | Token | Value |
|---|---|---|
| Height | container height | 40 (matches container) |
| Padding (horizontal, per item) | `spacing.s4` | 16 |
| Min width | — | auto (text-sized) |
| Font | `font.mono` (JetBrains Mono) | — |
| Font size | `fontSize.xs` | 10.5 |
| Font weight (rest) | 400 | — |
| Font weight (active) | 500 | — |
| Letter spacing | 0.08em | — |
| Text transform | uppercase | — |
| Foreground (rest) | `color.ink.muted` | — |
| Foreground (active) | `color.ink.charcoal` | — |
| Active indicator | 2px solid `color.unibe-red`, bottom edge, full-width of item minus inner 16px padding | — |
| Active indicator offset | `-1px` (so it overlaps the container's border-bottom) | — |
| Gap between items | 0 (items butt directly; gap is via per-item padding) | — |

```
container left = 24px padding
            ↓
  ┌─────────────────────────────────────────────┐  ← canvas.warm bg
  │   TAB 1   │   TAB 2   │   TAB 3            │  ← items with own padding
  │  ════════                                    │  ← active 2px bar (under tab 1 here)
  └─────────────────────────────────────────────┘  ← hairline bottom
```

---

## Variants

### default
The spec above. Used for in-page navigation.

### compact
Same as default but `control.height.sm = 32` and `padding-x.sm = 16`. Used in dense BI tools.

---

## States (per tab item)

### rest
Foreground `color.ink.muted`. No background. No indicator.

### hover
Foreground → `color.ink.charcoal`. No background change. No indicator.

### active (selected)
Foreground → `color.ink.charcoal`, weight 500. Bottom indicator visible.

### focus (keyboard)
Outline: 2px `color.unibe-red` offset -2px (inset) — outline lives WITHIN the tab item, not outside.

### disabled
Opacity: `opacity.disabled`. No hover, no click.

---

## Motion

| Transition | Token |
|---|---|
| Tab item color change (rest → hover, rest → active) | `motion.duration-fast = 180ms` linear |
| Active indicator slide | `motion.duration-fast = 180ms` + `motion.ease-out-quart` — **the bar slides between tabs**, doesn't fade |
| Content area transition (when tab changes) | `motion.duration-medium = 300ms` opacity fade |

### Slide mechanic
The active indicator is a single 2px line rendered once at the parent level. When `activeTab` changes, the bar animates `transform: translateX(...)` to the new position + width. This produces the "Linear/Bloomberg-style" sliding active indicator that's a key LIULIAN visual identifier.

**Do not** render the indicator inside each tab item with show/hide animation — that's the "Material Indicator" pattern (separate animations per item) and looks different.

---

## Accessibility (WCAG 2.2 AA)

- **Role**: `tablist` (container) + `tab` (items) + `tabpanel` (content area)
- **ARIA-selected**: only the active tab has `aria-selected="true"`
- **Keyboard nav**:
  - Tab key → focuses the active tab (not all tabs)
  - Left/Right arrows → moves between tabs, activates on focus (auto-activate)
  - Home/End → first/last tab
  - Enter/Space → activates focused tab (only relevant if auto-activate is off)
- **Touch target**: each tab item ≥ 44pt iOS / 48dp Android+Harmony (achieved via `control.height.md = 40` + 8px vertical padding wrap = 56)
- **Contrast**:
  - ink.muted on canvas.warm: 6.0:1 ✓ AA
  - ink.charcoal on canvas.warm (active): 17.0:1 ✓ AAA
  - unibe-red bar at 2px: not a text contrast concern; only an indicator

---

## Props

```typescript
interface LiulianTabProps {
  variant?: 'default' | 'compact';   // default: 'default'
  items: Array<{
    id: string;                        // stable identifier
    label: string;
    disabled?: boolean;
    ariaControls?: string;             // tabpanel id (web a11y)
  }>;
  activeId: string;
  onChange: (id: string) => void;
  align?: 'left' | 'center';           // default: 'left'
}
```

---

## Implementation notes

### iOS (SwiftUI)
- Use `HStack` for tab items
- Indicator: a separate `Rectangle().fill(LiulianTokens.Colors.unibeRed).frame(height: 2)` positioned absolutely via `.offset()` based on selected tab's measured frame
- Use `PreferenceKey` to bubble each tab's frame to the parent for offset calculation
- Animate indicator position with `.animation(.timingCurve(0.16, 1, 0.3, 1, duration: 0.18), value: activeId)`

### Android (Compose)
- Use `Row` for tab items
- Indicator: `Box(modifier = Modifier.offset(x = indicatorX).width(indicatorWidth).height(2.dp))`
- Use `onPlaced` callbacks to measure each tab's coordinates
- Animate via `animateDpAsState` with `tween(durationMillis = 180, easing = LiulianTokens.Easing.easeOutQuart)`

### HarmonyOS (ArkUI)
- Use `Row` for tab items
- Indicator: `Stack` with positioned bar; use `.position({ x: ..., y: ... })` and `.animation({ ... })` 
- Measure tab widths via `.onAreaChange`

### Web (React)
- Use Radix UI Tabs primitive for a11y skeleton; override visuals via Tailwind + custom indicator slide
- Indicator: absolute-positioned `<div>` with `transform: translateX(...)` driven by the active tab's offsetLeft

---

## What this spec rules out

- ❌ Pill-style tab indicators (`radius.pill` background fill) — that's iOS UISegmentedControl, not LIULIAN
- ❌ Multi-color tabs (each tab a different color) — LIULIAN restraint
- ❌ Icon-only tabs at default size — labels are the affordance; icons can be added via item but labels must be present
- ❌ Underline-on-hover (only active state gets the indicator)
