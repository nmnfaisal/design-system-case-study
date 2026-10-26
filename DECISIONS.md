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