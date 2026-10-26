# Decisions log

Running record of design/API decisions and the reasoning behind them.
Not submitted docs — interview prep + rationale for the git history.

## Alert

### D1 — Body via content projection, title as input
**Chose:** `title` is a string `input()`; body content comes through `<ng-content>`.
Usage: `<ds-alert variant="warning" title="...">Body text with optional <a>link</a>.</ds-alert>`
**Why:** Body legitimately needs rich inline content (links, emphasis) — a string
input can't carry that without an html-string + sanitizing, which is worse. Title is
always a short plain string, so an input keeps the component in control of its styling
and heading semantics.
**Rejected:** all-inputs (can't do rich body); title-as-slot (unnecessary — title has
no formatting needs).
**Trade-off noted:** projection lets callers over-fill the body; spec's "avoid
paragraph-length alerts" is treated as a usage guideline, not component-enforced.

### D2 — Action via slot, caller supplies the element
**Chose:** Action is projected into a named slot; the caller passes the actual
`<a>` or `<button>`, marked with an attribute (e.g. `ds-alert-action`), and the
component styles/positions it.
**Why:** Same "caller gives content, component styles it" model as D1. Lets the
caller pick the correct element — `<a>` for actions that navigate (e.g. "Update
payment method"), `<button>` for in-place actions (e.g. "Try again") — which only
the caller can know. Keeps the API small (no actionLabel/href/event inputs).
**Rejected:** actionLabel input + (action) output — forces one element type for all
callers, wrong for half the spec's own examples, and grows the API to patch it.
**Trade-off noted:** slot is less discoverable than a named input; mitigated by
showcase examples.

### D3 — Dismiss is stateless (parent owns visibility)
**Chose:** Alert holds no visibility state. On dismiss tap it emits the existing
`dismissed` output; the parent decides whether to keep showing it.
**Why:** State hoisting — the parent usually needs to know about the dismiss anyway
(persist "don't show again", analytics, re-flow layout). A self-hiding Alert would
swallow that silently. Keeps the component predictable and easy to test. Matches the
starter, which already exposes `dismissed = output<void>()` and no internal state.
**Rejected:** self-hiding Alert — hides information the parent needs and can't
participate in list animations / persisted preferences.
**Trade-off noted:** simplest "just close it" use needs one line of parent state;
acceptable. Could add an optional self-managing wrapper later, out of scope for 4h.

### D4 — ARIA role by variant (urgency-based)
**Chose:** error/warning → role="alert" (assertive — screen reader interrupts and
announces immediately); info/success → role="status" (polite — announces without
interrupting). Role is computed from the variant.
**Why:** Roles should map to real urgency. Interrupting is right for a problem
("We couldn't save your changes") and wrong/annoying for a success confirmation.
Blanket role="alert" is technically accessible but shouts success messages as if
urgent. The design spec explicitly requires justifying "exact assistive-technology
semantics"; INTERVIEW-TOPICS lists roles + announcement behavior.
**Rejected:** blanket role="alert" (over-alerts on non-urgent variants); blanket
role="status" (under-alerts on errors).
**Note:** live-region roles announce when the alert appears/changes dynamically
(the common case). Static-on-load alerts read in normal order regardless — role is
still declared so dynamic use behaves correctly.

## Alert — smaller decisions (S1–S10)

### S1 — Icon: optional, built-in default per variant, inline SVG
Built-in glyph per variant (info/success/warning/error), rendered as inline SVG so
it inherits the variant color via `currentColor`. Caller can turn it off.
**Why SVG not emoji/font:** scales crisply at any density and inherits color — same
reason mobile ships vector drawables, not bitmap icons, for multi-density screens.
**Mobile angle:** on small screens the icon is the fastest pre-attentive urgency cue
(colour + shape) before any text is read — matters more on a phone where the message
may wrap to 3–4 lines.

### S1a — Icon shows by default (showIcon = true)
Spec marks icon "optional" but shows it in nearly every example. Default on; opt out.
**Why:** match the spec's visual default; principle of least surprise.

### S2 — New token --ds-alert-body-text (both brands)
Body gets its own semantic token rather than reusing --ds-text-muted.
**Why:** spec gives body a distinct colour (#4f5867); alert body text is a distinct
semantic role from generic muted text. Clean token naming is an interview topic.
**Cross-platform angle:** a semantic token name (alert.body.text) maps 1:1 to a
Compose/SwiftUI theme attribute; a generic "muted grey" wouldn't translate cleanly.

### S3 — Action inherits variant colour (no new token)
Spec says action uses `color: inherit`. Action picks up the variant colour.
**Why:** matches spec; fewer tokens to maintain.

### S4 — Dismiss is a native <button>, icon-only ×, aria-label="Dismiss"
**Why:** native button = free keyboard operability + correct screen-reader role.
**Mobile angle:** same principle as using a real touch target / accessible node on
Android rather than a tappable image — you get platform a11y behaviour for free
instead of re-implementing it.

### S5 — Dismiss hit target 44×44px (visual × stays 20px)
Visual glyph 20px per spec; clickable area padded to 44×44.
**Why:** spec says "interactive target should be appropriately sized." 44px is the
WCAG 2.5.5 / Apple HIG standard; Android Material uses a 48dp minimum.
**Mobile angle:** this is the single most mobile-relevant decision — a 20px tap
target is a thumb-miss on a phone. 44–48px is exactly the min-touch-target rule I'd
apply on Android. Strongest cross-platform talking point in the set.

### S6 — Focus ring via existing --ds-focus token, with offset
Visible outline using --ds-focus (violet Luma / teal Nova), small offset.
**Why:** token already exists, so focus colour is brand-correct automatically;
satisfies "usable focus treatment."
**Mobile angle:** on web, keyboard/switch-access focus is the equivalent of focus
order / accessibility focus on Android; same obligation, different surface.

### S7 — Compact breakpoint at 40rem (640px): 14px padding + block action
Below 640px, padding 16px→14px and action goes full-width block.
**Why:** spec references a 375px phone and compact padding; 640px is a conventional
phone/small-tablet breakpoint. Judgment call, documented as such.
**Mobile angle:** full-width block action below the breakpoint = the same reasoning
as a full-width primary button on a phone — easier thumb target, clearer primary
action when horizontal space is tight. Responsive-by-container, not device-sniffing,
mirrors how adaptive layouts should work cross-platform.

### S8 — No dismiss animation (instant removal)
**Why:** 4h timebox, polish not substance; stateless component (parent owns
visibility) makes an exit animation awkward to own. Intentional cut.
**Mobile angle:** note for interview — on Compose I'd hoist this to
AnimatedVisibility in the parent for the same state-ownership reason, so the "where
the animation belongs" argument is identical on both platforms.

### S9 — Title and body independently optional
title-only, body-only, or both valid. If title omitted, body aligns with the icon.
**Why:** straight from spec anatomy rules.

### S10 — Host element (ds-alert) carries role + variant styling
No inner wrapper div; the component host is the alert.
**Why:** cleaner DOM, idiomatic Angular, the component *is* the alert.
**Mobile angle:** equivalent to putting the semantics on the component's root node
rather than nesting an extra container — same instinct as a flat view hierarchy.

### D5 — Alert body-text token value
**Chose:** `--ds-alert-body-text` set to `#4f5867` for **both** Luma and Nova.
**Why:** body copy stays brand-neutral; the brand expresses through accent colours
(bg, border, icon, action), not body text. The token still exists per S2 so a brand
can diverge later without touching component code — tokens encode intent and future
flexibility, not only current differences.
**Rejected:** reusing `--ds-text-muted` (would skip the semantic token S2 calls for);
a distinct Nova grey (no source calls for one, adds difference without reason).

### D6 — Title rendered as a non-heading element
**Chose:** Render the alert title as a styled non-heading element (e.g. `<strong>`
or a `<p>` with title styling), **not** `<h3>` and not any heading element.
**Why:** the alert already uses live-region roles (`role="alert"` / `"status"`, D4),
so the whole region is announced as a unit when it appears — the title does not need
heading semantics. Emitting a fixed `<h3>` would risk breaking the host page's heading
outline (skipped levels), an a11y regression a shared component cannot predict.
**Rejected:** fixed `<h3>` (heading-order risk, copies the mockup uncritically);
configurable heading-level input (more API than a 4h build needs — noted as the
escape hatch if a consumer ever needs the title in the heading outline).

### D7 — ::ng-deep used to style the projected action
**Chose:** Style the caller-projected action via `:host ::ng-deep [ds-alert-action]`.
**Why:** Angular's style encapsulation does not reach projected (`<ng-content>`)
content, so a component cannot style what a caller projects without piercing
encapsulation. `::ng-deep` is the standard mechanism; scoping it with the `:host`
prefix keeps it from leaking outside this component.
**Trade-off noted:** `::ng-deep` is deprecated but has no official replacement for
this case. Alternatives considered: expose a shared CSS class for callers to apply
(pushes styling responsibility onto the caller, worse DX), or wrap the action slot
in a component-owned element (more markup). For a 4h build, scoped `::ng-deep` is the
pragmatic, conventional choice.

## Card

### CD1 — One ds-card component with three named slots
**Chose:** A single `ds-card` component with three named content-projection slots —
header, body, footer — rather than a family of sub-components (ds-card-header, etc.).
Caller marks projected content with attributes (e.g. ds-card-header / ds-card-body /
ds-card-footer).
**Why:** Consistent with the Alert's slot philosophy, so both components read as one
system. The component owns the structure (header top, footer bottom), which is the
point of a design-system card — it guarantees consistent layout across teams; they
can't build an inconsistent card. Smaller and clearer than four components for a 4h
build.
**Rejected:** sub-component family (like Angular Material's mat-card) — more flexible
(reorder/repeat/omit parts freely) but more boilerplate and surface area to misuse;
flexibility not needed for the system's current needs.
**Cross-platform angle:** same as a Compose `Card(header, body, footer)` with slot
lambdas vs. separate CardHeader/CardBody composables — the single-composable-with-slots
approach is the standard choice for a consistent card, clean call site.

### CD2 — Header image as a component-owned input (imageSrc + imageAlt)
**Chose:** Optional header image provided via inputs `imageSrc` and `imageAlt`; the
component renders and sizes the <img> itself (fixed aspect, object-fit: cover, clipped
top corners, lazy-loaded). A deliberate departure from the slot-default used elsewhere.
**Why:** The image is a structured, conversion-critical element the card should own,
not freeform content.
  - WebView-heavy mobile context: their apps render web components inside WebViews on
    phones, so a component-owned image lets the system standardize aspect-ratio (no
    layout shift while loading), lazy-loading, and sizing once, for every team —
    avoiding jank on mid-range devices in a conversion funnel.
  - E-commerce/lottery: product/jackpot images have a fixed job and shape; owning them
    guarantees visual consistency across multiple storefront brands off one system.
  - Accessibility: imageAlt as a paired input makes alt text a visible, documentable,
    enforceable part of the contract (INTERVIEW-TOPICS flags Card image alt text);
    a slot lets a rushed team omit alt.
**Rejected:** image as a slot (caller supplies <img>) — maximal flexibility but
inconsistent sizing, no enforced a11y, risk of layout shift in WebViews.
**Trade-off noted:** an input locks callers to a plain <img> (no <picture>/srcset
art-direction). If responsive art-direction became a real need, extend the input to
emit srcset/<picture> INSIDE the component — keep image handling component-owned
rather than opening a freeform slot.

### CD3 — Header image is full-bleed across the top
**Chose:** The optional header image spans the full card width at the top (edge to
edge, ignoring inner padding), top corners clipped to the card radius, header text
below it. Not an inline thumbnail beside the title.
**Why:** For an e-commerce/lottery card the image is the hero that drives the click,
not a decorative thumbnail — full-bleed top image is the standard conversion-oriented
e-commerce card pattern. Pairs with CD2: a full-bleed image has a predictable shape
the component can standardize (full width, fixed aspect, object-fit: cover, clipped
top corners). Also the stronger showcase piece.
**Rejected:** inline thumbnail beside header text (list-item/contact style) — suited
to dense lists, not hero-led product cards. If a dense list-style card were needed
later, that's a variant/separate component, not a reason to make this one inline.
**Cross-platform angle:** same as a Compose product card — Image at the top of the
Column, fillMaxWidth + fixed aspectRatio + ContentScale.Crop, card shape clipping the
top corners. You lead with the hero image, not a tiny leading thumbnail.

### CD4 — Card is <article>; header title is a caller-supplied heading
**Chose:** The card container renders as <article> (self-contained content unit). The
header title is a real heading element, but supplied BY THE CALLER through the header
slot (e.g. <h3 ds-card-header>), with the component styling whatever heading lands
there. No hardcoded heading level, no input for it.
**Why:** A product/lottery card is a self-contained item, so <article> gives
screen-reader users a meaningful boundary between cards. A real heading in the header
aids heading-based navigation when scanning a page of cards. Because the header is a
slot (CD1), the caller already controls the element and picks the correct level for
their page — so the component never injects a wrong heading level into a page
hierarchy it can't see. (Contrast D6: the Alert deliberately avoided a heading because
its live-region role announces the whole region; the Card is static content, so the
reasoning flips.)
**Rejected:** <section> (implies a heading, vaguer fit); plain <div> (throws away free
semantics); hardcoded heading level (risks skipping levels in the host outline).
**Cross-platform angle:** <article> ≈ giving the card its own semantics boundary so a
screen reader treats it as one item; caller-controlled heading level ≈ not hardcoding
heading semantics in a reusable component when you don't control the surrounding
hierarchy — same discipline on Android.

### Card — smaller decisions (CS1–CS7)

**CS1 — Padding from the --ds-space-* scale**
Header/body/footer inner padding uses existing spacing tokens (e.g. --ds-space-4 =
16px). Full-bleed image is the exception — ignores padding (CD3).
Why: reuse the token scale, no magic numbers, consistent with the Alert.

**CS2 — Subtle border + light shadow**
1px border via a neutral token plus a light shadow for slight lift.
Why: matches the starter's existing card-like boxes (border + soft shadow), keeps the
system coherent; a design-system card should be subtle, not loud.

**CS3 — Corner radius reuses --ds-radius-md**
Same token the Alert uses (12px Luma / 4px Nova).
Why: radius is a brand signal; the shared token means the Card gets each brand's corner
style automatically — tokens do the brand switch, zero extra code.

**CS4 — Footer right-aligned by default**
Footer actions align right by default; caller can override (it's a slot).
Why: right-aligned actions are the common card convention; slot keeps it flexible.

**CS5 — Reuse globals; add new Card token(s) only where needed**
Reuse --ds-surface (background), --ds-radius-md, --ds-space-*, text tokens. Add a
small number of semantic Card tokens (likely --ds-card-border, possibly
--ds-card-shadow) only where the Card has its own styling concern, added to BOTH
brands. Exact new token(s) to be confirmed at build time, not added silently.
Why: reuse first (consistency, less surface); a semantic token only where justified.

**CS6 — Fluid, container-driven sizing (no card-level breakpoint)**
Card fills its container width; content reflows; full-bleed image scales with it.
Why: a card should adapt to whatever column it's placed in (1-col mobile, grid
desktop) rather than own a breakpoint.
Mobile/WebView angle: container-driven sizing is what you want when the same component
renders in a narrow WebView vs a wide desktop — it adapts to the slot it's given.

**CS7 — Static container, not a clickable card**
The card is not a whole-card link; interactive elements live inside it.
Why: a whole-card link creates nested-interactive a11y problems and unclear focus; the
brief doesn't ask for it. Intentional cut.
Mobile angle: same reason you avoid a clickable card wrapping clickable children on
Android — nested click targets and ambiguous focus/semantics.