# SPEC-alert.md — ds-alert Engineering Spec

## Purpose

A multi-variant inline alert for surfacing contextual messages. One implementation
serves both brands (Luma / Nova) via design tokens. Supports optional title, projected
body content, optional action, optional dismiss, and an optional leading icon.

---

## Public API

### Selector

`ds-alert` (standalone component, `ds-` prefix per CLAUDE.md)

### Inputs

| Name | Type | Default | Source | Notes |
|---|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Starter | Drives colors, icon glyph, and ARIA role |
| `title` | `string \| undefined` | `undefined` | D1, D6 | Plain-text title. Rendered as a non-heading styled element |
| `dismissible` | `boolean` | `false` | Starter | Shows / hides the dismiss button |
| `showIcon` | `boolean` | `true` | S1a | Shows / hides the leading icon. On by default |

### Outputs

| Name | Type | Source | Notes |
|---|---|---|---|
| `dismissed` | `void` | D3 | Emitted on dismiss click. Component holds no visibility state — parent decides whether to remove it |

### Content-projection slots

| Slot | Selector | Source | Notes |
|---|---|---|---|
| Body (default) | `<ng-content>` | D1 | Rich inline content (links, `<em>`, etc.). Not a string input |
| Action | `<ng-content select="[ds-alert-action]">` | D2 | Caller provides `<a>` or `<button>` with the `ds-alert-action` attribute. Component styles and positions it |

### Usage example

```html
<ds-alert
  variant="warning"
  title="Payment method expiring"
  [dismissible]="true"
  (dismissed)="onDismiss()"
>
  Your card ending in 4242 expires next month.
  <a ds-alert-action href="/settings/payment">Update payment method</a>
</ds-alert>
```

---

## Behaviour

### Variants

Four variants: `info`, `success`, `warning`, `error`. Each maps to its own set of
color tokens (`--ds-alert-{variant}-bg`, `-border`, `-icon`) and a built-in icon glyph.
*(Spec §Desktop / core variants)*

### Icon (S1, S1a)

- Built-in inline-SVG glyph per variant, inheriting variant color via `currentColor`.
- Glyphs: **i** (info), **✓** (success), **!** (warning), **!** (error).
- 20 × 20 px per spec anatomy.
- Shown by default (`showIcon = true`). Caller opts out with `[showIcon]="false"`.
- When hidden, the icon column collapses; content starts at the left edge.

### Title and body (D1, S9)

- Independently optional: title-only, body-only, or both are valid.
- If title is omitted, body aligns directly with the icon (spec anatomy: "If omitted,
  body aligns with icon").
- Title: 14px / 20px line-height, semibold. Body: 13px / 19px line-height.
  *(Spec §Anatomy & spacing — Rules)*

### Action (D2, S3)

- At most one primary text action per alert *(spec §Rules)*.
- Projected via the `[ds-alert-action]` attribute selector.
- Styled by the component: underlined, `text-underline-offset: 2px`, inherits variant
  color — no new token (S3).
- Caller chooses element type: `<a>` for navigation, `<button>` for in-place actions.

### Dismiss (D3, S4, S5, S8)

- Native `<button>`, icon-only `×` glyph, `aria-label="Dismiss"` (S4).
- Visual glyph: 20 px. Interactive hit target: 44 × 44 px (S5).
- Stateless: emits `dismissed` output; component does not self-hide (D3).
- No animation — instant removal (S8).

---

## Accessibility

### Role by variant (D4)

| Variant | `role` | Behaviour |
|---|---|---|
| `error` | `alert` | Assertive — screen reader interrupts and announces |
| `warning` | `alert` | Assertive |
| `info` | `status` | Polite — announces without interrupting |
| `success` | `status` | Polite |

Role is set on the **host element** `<ds-alert>` (S10).

### Title semantics (D6)

- Title is a **non-heading styled element** (e.g. `<strong>`), not `<h3>` or any
  heading. The live-region role announces the alert as a unit; a fixed heading level
  would risk breaking the host page's heading outline.

### Dismiss button (S4)

- `<button type="button">` with `aria-label="Dismiss"`.
- Keyboard operable natively (Enter / Space).

### Action

- Caller provides a native `<a>` or `<button>` — correct semantics follow from the
  element choice (D2). Component does not add or override roles.

### Focus (S6)

- Visible focus ring on dismiss button and action element.
- Uses `--ds-focus` token (violet for Luma, teal for Nova) with a small offset.

---

## Responsive (S7)

**Breakpoint:** `40rem` (640 px)

| Property | ≥ 640 px (desktop) | < 640 px (compact) |
|---|---|---|
| Alert padding | 16 px (`--ds-space-4`) | 14 px (0.875 rem) |
| Action display | inline | block (full-width) |

*(Spec §Anatomy — "Outer padding: 16 px desktop · 14 px compact/mobile";
Spec §Mobile behavior — action becomes block on mobile.)*

---

## Tokens

### Existing tokens consumed

| Token | Usage |
|---|---|
| `--ds-alert-{variant}-bg` | Background per variant (4 × 2 brands) |
| `--ds-alert-{variant}-border` | Border per variant |
| `--ds-alert-{variant}-icon` | Icon color + variant accent color |
| `--ds-radius-md` | Border radius (12 px Luma / 4 px Nova) |
| `--ds-space-4` | Desktop padding (16 px) |
| `--ds-space-2`, `--ds-space-3` | Internal spacing (gap, margins) |
| `--ds-focus` | Focus ring color |
| `--ds-text` | Title text color |

### New token to add (S2)

| Token | Luma | Nova | Notes |
|---|---|---|---|
| `--ds-alert-body-text` | `#4f5867` | `#4f5867` | Same value both brands (D5). Distinct from `--ds-text-muted`. Added to both brands in `tokens.scss` |

No new token for the action color — action inherits the variant color (S3).

---

## Out of scope (intentional cuts)

| Cut | Reason | Source |
|---|---|---|
| Dismiss animation | Timebox; parent owns visibility, making exit animation awkward to own | S8 |
| Self-hiding alert | Parent owns visibility | D3 |
| Body-length enforcement | "Avoid paragraph-length alerts" is a usage guideline, not component-enforced | D1 |
| Multiple actions | Spec: "at most one primary text action in this version" | Spec §Rules |

---

## Acceptance criteria

1. All four variants render with correct background, border, and icon colors from tokens.
2. Brand switcher toggles Luma ↔ Nova appearance with no code changes — only token values differ.
3. Title displays when provided; hidden when omitted; no empty element in DOM when omitted.
4. Body content projected via `<ng-content>` renders correctly, including inline HTML (links, emphasis).
5. Action element projected via `[ds-alert-action]` is styled and positioned by the component.
6. Dismiss button appears only when `[dismissible]="true"`.
7. Clicking dismiss emits `dismissed`; the component does not self-hide.
8. Leading icon shows by default; hidden when `[showIcon]="false"`.
9. `role="alert"` on error/warning; `role="status"` on info/success.
10. Dismiss button has `aria-label="Dismiss"` and is operable via keyboard (Enter / Space).
11. Visible focus ring on dismiss button and action, using `--ds-focus` token color.
12. Below 640 px: padding reduces to 14 px; action becomes block-level.
13. No hardcoded colors anywhere in component SCSS — everything via `var(--ds-*)`.
14. Host element `<ds-alert>` carries role and variant styling directly — no inner wrapper div (S10).
15. Grid layout matches spec anatomy: icon column (20 px) | content (1fr) | dismiss (auto).

