# LiulianButton

Primary interactive control. Used for form submission, navigation actions, and any "do a thing" affordance.

**Reference:** `refs/Button.reference.png` (rendered at 4× zoom for pixel inspection)

---

## Anatomy

| Property | Token | sm | md (default) | lg |
|---|---|---|---|---|
| Height | `control.height.*` | 32 | **40** | 48 |
| Padding (horizontal) | `control.paddingX.*` | 16 | **24** | 28 |
| Icon size | `control.iconSize.*` | 14 | **16** | 18 |
| Icon → label gap | `control.iconGap` | 8 | **8** | 8 |
| Border radius | `radius.md` | 10 | **10** | 10 |
| Font | `font.body` (Switzer) | 500 weight | **500 weight** | 500 weight |
| Font size | `fontSize.*` | sm (12) | **md (13.5)** | lg (15) |
| Letter spacing | — | normal | normal | normal |

**Touch target padding (invisible)**: wraps the visual button so total tappable area ≥ `touch.minTarget-{platform}` (iOS 44, Android+Harmony 48). The visual is centered within.

---

## Variants

### primary (default)
- Background: `color.unibe-red`
- Foreground: `color.surface-pure`
- Border: none

### secondary
- Background: `color.surface-pure`
- Foreground: `color.ink-charcoal`
- Border: 1px `color.hairline`

### ghost
- Background: transparent
- Foreground: `color.ink-muted`
- Border: none

### danger
- Same anatomy as primary, but `color.unibe-red.deep` background (destructive intent)

---

## States

State key: `(rest | hover | active | focus | disabled | loading)`

### rest
Default appearance per variant. No shadow (LIULIAN editorial-Swiss = sparse shadow).

### hover
| Variant | Change |
|---|---|
| primary | bg → darken 8% (`color.unibe-red.deep`) |
| secondary | bg → `color.canvas.warm`, border → `color.hairline.strong` |
| ghost | bg → `color.canvas.warm` |
| danger | bg → darken 8% |

Transform: `translateY(-1px)` (subtle lift, all variants).
**No shadow on hover** for the button itself (Card uses shadow, Button doesn't).

### active (press)
- Transform: `translateY(0) scale(control.scaleActive = 0.98)`
- Opacity: 0.95
- Override hover bg

### focus
- Visible always (not just keyboard) — brand requirement
- Outline: `focus.ringWidth = 2px` solid `color.unibe-red`, offset `focus.ringOffset = 2px`
- Renders outside the button bounds (`overflow: visible`)

### disabled
- Opacity: `opacity.disabled = 0.4`
- Cursor: not-allowed (web only)
- All hover/active disabled
- Focus ring still visible if focused (a11y)

### loading
- Replace label with `LiulianSpinner` (16px, primary uses `surface-pure`, secondary uses `ink-charcoal`)
- Icon hidden during loading
- Click suppressed (effectively disabled but no visual gray-out)
- Spinner fades in over `motion.duration-medium = 300ms`

---

## Motion

| Transition | Token | Notes |
|---|---|---|
| rest ↔ hover | `motion.duration-fast = 180ms` + `motion.ease-out-quart` | bg color + translateY |
| hover → active | `motion.duration-instant = 80ms` + `motion.ease-out` | scale + opacity |
| active → rest | `motion.duration-fast = 180ms` + `motion.ease-out-quart` | unwind |
| focus ring fade-in | `motion.duration-instant = 80ms` + linear | opacity 0 → 1 |
| loading spinner fade-in | `motion.duration-medium = 300ms` + linear | opacity 0 → 1, rotation 360° infinite |

---

## Accessibility (WCAG 2.2 AA)

- **Role**: implicit `button` (web `<button>`, iOS `accessibilityRole(.button)`, Compose `Modifier.semantics { role = Role.Button }`, ArkUI `accessibilityLevel('yes')` with role hint)
- **Disabled state**: announces "dimmed/disabled" to screen reader
- **Loading state**: announces "loading" + live region update when state changes
- **Touch target**: ≥ `touch.minTarget-{platform}` regardless of visual size (sm Button's tappable area is still 44/48)
- **Contrast ratios**:
  - primary: `unibe-red #E20613` on white → contrast 5.3:1 ✓ AA-large, ✗ AA-normal-body (only used for label, label is ≥ 14px so passes AA-large)
  - foreground on background, all variants → ≥ 4.5:1 verified per the test in `vr-baseline/contrast.json`
- **Keyboard**: Tab to focus, Enter / Space to activate (web/desktop), VoiceOver/TalkBack double-tap (mobile)

---

## Props (canonical API — all platforms mirror this)

```typescript
interface LiulianButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; // default: 'primary'
  size?: 'sm' | 'md' | 'lg';                              // default: 'md'
  loading?: boolean;                                       // default: false
  disabled?: boolean;                                      // default: false
  icon?: IconRef;                                          // optional leading icon
  trailingIcon?: IconRef;                                  // optional trailing icon
  label: string;                                           // required visible label
  ariaLabel?: string;                                      // override accessible name (e.g. icon-only button)
  onPress: () => void;                                     // press handler
}
```

Platform mapping:
- **Web (React)**: `<LiulianButton variant="primary" onPress={...}>Forecast</LiulianButton>`
- **iOS (SwiftUI)**: `LiulianButton(variant: .primary, label: "Forecast", onPress: {...})`
- **Android (Compose)**: `LiulianButton(variant = ButtonVariant.Primary, label = "Forecast", onPress = {...})`
- **HarmonyOS (ArkUI)**: `LiulianButton({ variant: ButtonVariant.Primary, label: 'Forecast', onPress: () => {} })`

---

## Implementation notes

### iOS (SwiftUI)
- Use `Button` shell only for accessibility wiring; render visuals via `ZStack { RoundedRectangle.fill + HStack { Image + Text } }`
- Disable `buttonStyle(.plain)` to kill system highlight; implement own press scale via `@GestureState`
- Disable focus ring via `.buttonStyle(.borderless)`; render own focus ring via `.overlay(RoundedRectangle.stroke(...))` based on `@FocusState`

### Android (Compose)
- Use `Box` + `Modifier.clickable(indication = null)` — kill ripple
- Implement press scale via `MutableInteractionSource` + `collectIsPressedAsState`
- Custom focus ring via `Modifier.onFocusChanged + Modifier.border`

### HarmonyOS (ArkUI)
- Use `Stack` + `.onClick` + `.stateStyles({ pressed: { scale: ... } })` overridden with custom curve
- Disable default ArkUI Button ripple by using `Row` + `.onClick` instead of `Button` component

### Web (React)
- Use Radix UI `<Button asChild>` for a11y → inject our `<button>` with Tailwind classes
- Tailwind classes resolve via `tokens.css` custom properties (no hardcoded values)

---

## What this spec rules out

- ❌ Material 3 ripple animation (looks "Android-ish", breaks platform parity)
- ❌ iOS default `UIButton` rendering (different on each iOS version)
- ❌ Hover shadow (cards get shadows, buttons don't — LIULIAN editorial-Swiss)
- ❌ Rounded-full (pill) shape for primary action — only `radius.md`
- ❌ Gradient backgrounds (banned globally per impeccable shared design laws)

## Open questions

- [ ] Should `ghost` variant have a focus ring background fill at low opacity, or just outline? Open for VR review when implementations land.
- [ ] Should loading spinner replace icon AND label, or just label (icon stays)? Currently: replace both. Revisit if buttons-with-icons feel awkward mid-load.
