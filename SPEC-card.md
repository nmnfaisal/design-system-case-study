# SPEC-card.md — ds-card Engineering Spec

## Purpose

A general-purpose content card with structured header, body, and footer regions.
One implementation serves both brands (Luma / Nova) via design tokens. Supports an
optional full-bleed header image. The card is a static container — interactive
elements live inside it, not on the card itself.

---

## Public API

### Selector

`ds-card` (standalone component, `ds-` prefix per CLAUDE.md)

### Inputs

| Name | Type | Default | Source | Notes |
|---|---|---|---|---|
| `imageSrc` | `string \| undefined` | `undefined` | CD2 | URL for the optional full-bleed header image |
| `imageAlt` | `string` | `''` | CD2 | Alt text for the header image. Paired input — makes alt a visible, enforceable part of the contract |

### Outputs

None. The card is a static layout container with no own interactivity (CS7).

### Content-projection slots

| Slot | Selector | Source | Notes |
|---|---|---|---|
| Header | `<ng-content select="[ds-card-header]">` | CD1 | Caller supplies the header content, including a heading element at the correct level (CD4) |
| Body | `<ng-content select="[ds-card-body]">` | CD1 | Main content area. May contain any content, including other components (e.g. `ds-alert`) |
| Footer | `<ng-content select="[ds-card-footer]">` | CD1 | Typically actions. Right-aligned by default (CS4) |

### Usage examples

**Card with header image:**

```html
<ds-card
  imageSrc="/assets/product.jpg"
  imageAlt="Jackpot prize: Gold Edition bundle"
>
  <h3 ds-card-header>Gold Edition</h3>
  <p ds-card-body>Limited-time offer with bonus rewards and exclusive content.</p>
  <div ds-card-footer>
    <button>Add to cart</button>
  </div>
</ds-card>
```

**Card containing a ds-alert:**

```html
<ds-card>
  <h3 ds-card-header>Account settings</h3>
  <div ds-card-body>
    <ds-alert variant="warning" title="Payment method expiring" [dismissible]="true">
      Your card ending in 4242 expires next month.
      <a ds-alert-action href="/settings/payment">Update payment method</a>
    </ds-alert>
  </div>
  <div ds-card-footer>
    <a href="/settings">Manage settings</a>
  </div>
</ds-card>
```

---

## Behaviour

### Structure and slots (CD1)

- Single component with three named content-projection slots (header, body, footer),
  not a family of sub-components.
- The component owns the structure: header at top, body in the middle, footer at
  bottom. Callers project content into slots via attributes (`ds-card-header`,
  `ds-card-body`, `ds-card-footer`).
- All three slots are independently optional. A card with only a body, or only a
  header and footer, is valid.
- Each region and its padding render only when content is projected into that slot;
  an absent slot produces no empty padded region (CD6).

### Full-bleed header image (CD2, CD3)

- When `imageSrc` is provided, the component renders an `<img>` spanning the full
  card width at the top, edge to edge (ignoring inner padding).
- Fixed 16:9 aspect ratio (CD5), `object-fit: cover`, top corners clipped to the card radius.
- `loading="lazy"` for performance.
- Image appears above the header slot content.
- `imageAlt` provides the alt text; defaults to `''` (decorative) when not set.

### Footer (CS4)

- Footer content is right-aligned by default.
- Since footer is a slot, callers can override alignment with their own styles.

### No own interactivity (CS7)

- The card is a static container, not a clickable card.
- Interactive elements (buttons, links, alerts with dismiss) live inside the slots.
- The card itself has no outputs, no click handlers, no hover state.

---

## Accessibility

### Container semantics (CD4)

- The card host element renders as `<article>` — a self-contained content unit,
  giving screen-reader users a meaningful boundary between cards.

### Header heading (CD4)

- The caller supplies a heading element at the correct level for their page via the
  header slot (e.g. `<h3 ds-card-header>`). The component styles whatever heading
  element lands there but does not inject a heading level of its own.

### Image alt text (CD2)

- `imageAlt` input provides alt text for the header image. Paired with `imageSrc`
  as a visible, enforceable part of the API contract.
- Defaults to `''` (decorative image) — callers should provide meaningful alt text
  for content images.

### Interactive children

- Interactive elements inside slots (buttons, links, dismissible alerts) carry their
  own semantics. The card does not add or override roles on slotted content.

---

## Responsive (CS6)

- **No card-level breakpoint.** The card fills its container width; content reflows
  naturally.
- Full-bleed image scales with the card width.
- The parent layout (e.g. a grid of cards) controls how wide each card is at each
  viewport size.

---

## Tokens

### Existing tokens consumed

| Token | Usage |
|---|---|
| `--ds-surface` | Card background |
| `--ds-radius-md` | Corner radius (12 px Luma / 4 px Nova) — same token as Alert (CS3) |
| `--ds-space-4` | Inner padding for header / body / footer regions (CS1) |
| `--ds-text` | Default text color |
| `--ds-text-muted` | Secondary text color |
| `--ds-focus` | Focus ring for interactive children |

### New tokens (CS5)

New card-specific tokens will be confirmed at build time, not added silently. Likely
candidates:

| Token | Purpose | Notes |
|---|---|---|
| `--ds-card-border` | Card border color | Added to both brands. Neutral, subtle |
| `--ds-card-shadow` | Card box-shadow | Added to both brands. Light lift (CS2) |

Per CLAUDE.md: new tokens are added to `tokens.scss` for both brands, named
semantically. Exact values confirmed during implementation.

---

## Out of scope (intentional cuts)

| Cut | Reason | Source |
|---|---|---|
| Clickable / linked card | Nested-interactive a11y problems; brief doesn't ask for it | CS7 |
| Sub-component family | More surface area than needed; single component with slots is sufficient | CD1 |
| `<picture>` / `srcset` art-direction | Input locks to plain `<img>`; extend later if needed | CD2 |
| Card variants (e.g. elevated, outlined) | No decision calls for them; one appearance | — |

---

## Acceptance criteria

1. Card renders with `<article>` as the host/container element.
2. Header, body, and footer slots project content in the correct order (top → bottom).
3. All three slots are independently optional — absent slots collapse with no empty padded region (CD6).
4. When `imageSrc` is provided, a full-bleed `<img>` appears at the top at 16:9 aspect ratio, spanning edge to edge, top corners clipped to card radius.
5. Image has `alt` attribute set from `imageAlt` input; `loading="lazy"` is present.
6. When `imageSrc` is absent, no `<img>` element in the DOM.
7. Footer content is right-aligned by default.
8. Card with a `ds-alert` inside the body slot renders correctly — alert variant colors, dismiss, and action work inside the card.
9. Brand switcher toggles Luma ↔ Nova appearance — radius, border, colors change via tokens with no code changes.
10. No hardcoded colors in component SCSS — everything via `var(--ds-*)` tokens.
11. Card is fluid — fills container width, content reflows, image scales.
12. Card has subtle border and light shadow (CS2).
13. Caller-supplied heading in header slot is styled by the component regardless of heading level.
