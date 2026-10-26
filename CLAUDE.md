# CLAUDE.md — Project rules for this design-system case study

This is a take-home for a Design System Engineer role. Two components:
an **Alert** (design spec in `spec/design-spec.html`) and a **Card** (no spec,
designed by the candidate). They must serve two brands (Luma, Nova) from one
implementation, be accessible and responsive, and appear on the showcase page.

Timebox is ~4 hours. The reviewer cares about technical decisions, component API,
maintainability, accessibility, and the ability to explain trade-offs — not volume
of code. Favour the smallest clear solution over the clever one.

---

## Golden rule: you do not make product or design decisions

- If anything is ambiguous, unspecified, or could reasonably go more than one way,
  **STOP and ask me.** Do not assume, do not pick "a reasonable default" silently.
- Every design and API decision is already recorded in `SPEC-alert.md` /
  `SPEC-card.md`. Build **against the spec**. If the spec doesn't cover something,
  that's a gap — ask me, don't fill it yourself.
- Do not add features, props, variants, abstractions, or "nice to haves" that the
  spec didn't ask for. No speculative generality.

## Token & theming discipline (non-negotiable)

- Components **never** hardcode colors, hex values, radii, or brand-specific values.
  Read everything through `var(--ds-*)` custom properties from
  `src/app/design-system/tokens/tokens.scss`.
- One implementation serves both brands. There must be **no** `if brand === 'nova'`
  logic in component code and no brand-forked templates or styles. Brand differences
  live only in token values.
- If a needed token doesn't exist yet, **ask me** before adding it. New tokens are
  added to `tokens.scss` for **both** brands, named semantically
  (e.g. `--ds-alert-body-text`, not `--ds-gray-7`).
- Use the existing spacing scale (`--ds-space-*`) and radius tokens rather than
  raw rem/px where a token exists.

## Accessibility (graded — do not skip)

- Every interactive element (dismiss, action) must be reachable and operable by
  keyboard, with a visible, usable focus treatment.
- Interactive controls need an accessible name (e.g. `aria-label` on an icon-only
  dismiss button).
- Choose semantics/roles deliberately per the spec; do not sprinkle ARIA where
  native elements already carry semantics. Prefer native elements
  (`<button>`, `<a>`) over `<div>` with handlers.
- Respect target-size guidance from the spec for interactive hit areas.

## Angular conventions (match the existing starter — don't change the style)

- Standalone components only. No NgModules.
- Use the signals-based API: `input()`, `output()`, `signal()`, `computed()`.
  Do not reintroduce `@Input()` / `@Output()` decorators or `EventEmitter`.
- Component selector prefix is `ds-` for design-system components.
- Keep the file-per-component layout: `.ts`, `.html`, `.scss`, `.spec.ts`.
- SCSS stays scoped to the component. Global/token styles stay in `tokens.scss`
  and `styles.scss`.
- TypeScript is in strict mode — no `any`, no non-null-assertion hacks to silence
  the compiler. Fix the types properly.

## Testing

- Tests use **Vitest** with Angular's `TestBed` (not Karma/Jasmine). Match the
  existing `*.spec.ts` setup.
- Write a few high-value tests that prove behavior and API contract, not coverage
  padding. Wait until I tell you the API is stable before writing them.

## Workflow

- When I ask for analysis or a plan, **do not edit files.** Analysis and planning
  are read-only until I approve.
- Make focused changes. Touch only the files relevant to the current step. Don't
  refactor unrelated code or reformat whole files.
- After a change, tell me briefly what you changed and what I should look at in the
  browser to verify it. Don't run git commands — I handle commits myself.
- Do not edit: `main.ts`, `index.html`, `angular.json`, `package.json`,
  `tsconfig*.json`, or `spec/design-spec.html` unless I explicitly ask.