# Technical interview topics

After the coding challenge we will walk through your solution together in a technical interview. You do not need to write anything in this file — use the topics below to prepare. Notes for yourself are fine, but they are not part of the evaluation.

## Component API

- Which public API did you choose for the Alert and the Card, and why?
- Which alternatives did you consider (e.g. inputs vs. content projection, configuration vs. composition)?
- How did you structure the Card's header, body, footer, and optional header image?
- How do the Alert and the Card work together when an Alert is placed inside a Card?

## Tokens and theming

- How do the same components serve both brands without forking the implementation?
- Which tokens did you use or add, and how would you name and organize them?

## Accessibility

- Semantics and roles, announcement behavior, focus and keyboard behavior.
- Dismiss and action controls, alternative text for the Card image, contrast.

## Cross-platform strategy

- If these components also had to exist in Jetpack Compose and SwiftUI, what would you share across platforms, what would stay platform-specific, and how would you keep the implementations aligned?
  
## Ambiguities and assumptions

- What did the Alert specification not fully define, and what did you decide?
- The Card has no specification — which design decisions did you make, and on what basis?

## Testing

- Which tests did you write, and why do you consider them the most valuable?
- What would you test additionally before a production release?

## Timebox and next steps

- What did you intentionally leave out?
- What would you do before releasing the components to other product teams?

## AI tooling

- Which AI tools did you use, and for which parts of the task?
- How did you guide them, and how did you verify their output?
- Where did you change or reject what the AI suggested, and why?
