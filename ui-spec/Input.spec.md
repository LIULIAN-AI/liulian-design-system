# LiulianInput

Single-line and multi-line text entry. Single canonical form — variants vary by input semantic (text/password/search/number/textarea) but visual anatomy is unified.

**Reference:** `refs/Input.reference.png`

---

## Anatomy

| Property | Token | sm | md (default) |
|---|---|---|---|
| Height (single-line) | `control.height.*` | 32 | **40** |
| Padding (horizontal) | `spacing.s3` | 12 | **12** |
| Padding (vertical, single-line) | computed | (auto-center) | (auto-center) |
| Padding (vertical, textarea) | `spacing.s3` | 12 | 12 |
| Border | 1px `color.hairline` | always | always |
| Border radius | `radius.sm` | 4 | **4** |
| Background | `color.surface.pure` | — | — |
| Font | `font.body` (Switzer 400) | — | — |
| Font size | `fontSize.md` | 13.5 | **13.5** |
| Foreground | `color.ink.charcoal` | — | — |
| Placeholder color | `color.ink.faint` | — | — |
| Icon size (leading/trailing) | `control.iconSize.md` | 16 | 16 |
| Icon padding | `spacing.s2` | 8 | 8 |
| Label margin-bottom | `spacing.s2` | 8 | 8 |
| Help text margin-top | `spacing.s2` | 8 | 8 |

### Composition

```
┌──────────────────────────────────┐
│ Label (above, optional)          │  font.body 500, fontSize.sm, ink.charcoal
│  ┌────────────────────────────┐  │
│  │  [icon]  input text   [×]  │  │  the input box (height per size)
│  └────────────────────────────┘  │
│ Help text or error (below, opt.) │  font.body 400, fontSize.xs, ink.muted (or red on error)
└──────────────────────────────────┘
```

---

## Variants (by semantic, not visual)

| Variant | Notes |
|---|---|
| `text` | Default. Trailing × button to clear. |
| `password` | Trailing eye toggle. |
| `search` | Leading magnifying glass icon. ESC clears. |
| `number` | Right-aligned text. Up/down spinners on web only. |
| `textarea` | Multi-line. Min height 80px = `spacing.s9 + s7`. Resize via drag bottom-right (web); fixed on mobile. |

---

## States

### rest
Border: 1px `color.hairline`. Background: `color.surface.pure`.

### hover (web only)
Border: 1px `color.hairline.strong`.

### focus
- Border: 1px `color.unibe-red`
- Outline: 2px `color.unibe-red` offset 0 (replaces border with focus ring + border combined)
- Background unchanged
- Caret color: `color.unibe-red`

### filled (rest + has value)
No visual change. Optional: show clear-× button if `clearable`.

### error
- Border: 1px `color.unibe-red.text`
- Error message below: foreground `color.unibe-red.text`, fontSize.xs

### disabled
- Opacity: `opacity.disabled`
- Background: `color.surface.shade`
- Cursor: not-allowed (web)
- Input is `readonly` + `disabled`

### readonly
- Background: `color.surface.shade`
- Border: 1px `color.hairline`
- Foreground: `color.ink.charcoal` (no opacity reduction — content is the focus, just can't edit)

---

## Motion

| Transition | Token |
|---|---|
| rest ↔ focus border color | `motion.duration-instant = 80ms` linear |
| error message appearance | `motion.duration-fast = 180ms` + `motion.ease-out-quart`, slide-in from top + fade |
| value validation flash | none — error appears statically on submit, not on every keystroke |

---

## Accessibility (WCAG 2.2 AA)

- **Label**: `<label for="...">` (web), `accessibilityLabel(...)` (iOS), `Modifier.semantics { contentDescription = ... }` (Compose)
- **Error**: `aria-invalid="true"` + `aria-describedby="error-id"` (web); platform equivalents
- **Required field**: `aria-required="true"` + visible asterisk in label
- **Help text association**: `aria-describedby` linking to help message
- **Keyboard**: standard text-input keyboard nav (arrows, home/end, ctrl+a)
- **Focus order**: matches DOM/view order; tab through label-to-input-to-help
- **Contrast**: ink.charcoal on surface.pure → 17.6:1 ✓ AAA

---

## Props

```typescript
interface LiulianInputProps {
  variant?: 'text' | 'password' | 'search' | 'number' | 'textarea';  // default: 'text'
  size?: 'sm' | 'md';                  // default: 'md'
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorText?: string;                  // setting this triggers error state
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;                 // show × button when has value
  leadingIcon?: IconRef;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;               // Enter key (single-line only)
  ariaLabel?: string;
}
```

---

## Implementation notes

### iOS (SwiftUI)
- Use `TextField` for single-line; `TextEditor` for textarea
- Override default rounded-rectangle background via `.textFieldStyle(.plain).background(...)`
- Focus via `@FocusState`; render own focus ring via `.overlay`
- For password, use `SecureField`

### Android (Compose)
- Use `BasicTextField` (not Material `TextField` — too much styling baggage)
- Wrap in custom `Box` with border + padding to control visuals fully
- Focus state via `Modifier.onFocusChanged`

### HarmonyOS (ArkUI)
- Use `TextInput` for single-line, `TextArea` for multi-line
- Override `.placeholderColor`, `.backgroundColor`, `.borderColor`
- Custom focus styling via `.stateStyles({ focused: { ... } })`

### Web (React)
- Use Radix UI form primitives where applicable for a11y (`<Label>`, `<Form>`)
- Native `<input>` and `<textarea>` styled via Tailwind utilities from tokens

---

## What this spec rules out

- ❌ Floating label (Material style) — adds motion complexity, doesn't fit editorial-Swiss
- ❌ Underline-only border (Material) — looks too "search-bar"; we use full bordered box
- ❌ Color-encoded validity (green border when valid) — only error gets color treatment
