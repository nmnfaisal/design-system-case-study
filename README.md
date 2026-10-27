> **Submission notes (Noman):** My design decisions and rationale are in
> [DECISIONS.md](DECISIONS.md). Component specs: [SPEC-alert.md](SPEC-alert.md),
> [SPEC-card.md](SPEC-card.md).

---


# Design System Engineer — Take-home Case Study

## Context

You have joined a team responsible for a design system used by multiple product teams and multiple brands. Design has introduced a new **Alert** component, and the system also needs a **Card** component. Your task is to turn the supplied specification into a reusable Alert component and to design and build a Card component, both of which could become part of the shared component library.

**Timebox: maximum 4 hours.**

We do not expect production completeness. We care more about your technical decisions, component API, maintainability, accessibility, and ability to explain trade-offs than the amount of code produced.

## Your task

### 1. Alert component

Implement the Alert component in Angular using the starter repository and the design specification in [`spec/design-spec.html`](spec/design-spec.html).

The design calls for:

- `info`, `success`, `warning`, and `error` variants
- optional title and body content
- optional leading icon
- optional action
- dismissible and non-dismissible states
- two brands driven by shared design tokens rather than separate component implementations
- responsive behavior
- appropriate accessibility behavior

### 2. Card component

Build a Card component (e.g. `ds-card`). There is **no design specification and no starter code** for it — the structure, API, and styling are up to you. The Card must:

- consist of a **header**, a **body**, and a **footer**;
- optionally show an **image in the header**;
- work for both brands using the shared design tokens;
- be shown with several examples on the showcase page, **at least one of which contains your Alert component** inside the Card.

### Also include

1. **Examples/documentation** showing how another developer should use the components. The existing showcase page is a suitable place.
2. **Tests you consider valuable.** Exhaustive coverage is not required.

## Technical interview

The coding challenge is followed by a technical interview in which we discuss your solution together. You do not need to write documentation for it. [`INTERVIEW-TOPICS.md`](INTERVIEW-TOPICS.md) lists the topics you should be prepared to talk about.

## AI tooling

**We explicitly want you to solve this task with AI support.** Use the AI coding assistants or agents you would use in your daily work (e.g. Claude Code, GitHub Copilot, Cursor). We are interested in how you work with these tools: how you guide them, and how you review, verify, and correct their output. Be prepared to talk about this in the technical interview.

## Getting started

Requirements: Node.js 22.22.3+ or 24.15.0+, npm, and Git.

Before making any changes, initialize a Git repository and commit the untouched starter as your first commit. This lets us see exactly what you changed:

```bash
git init
git add .
git commit -m "Initial starter"
```

Then install and run the app:

```bash
npm install
npm start
```

Then open the local URL shown by Angular.

Tests:

```bash
npm test -- --watch=false
```

## What is already provided

- a runnable Angular app using standalone components, SCSS, and Vitest;
- two brand token sets and a simple brand switcher;
- a placeholder `ds-alert` component that compiles but is intentionally incomplete;
- a showcase page;
- the design specification for the Alert component.

There is no starter code or specification for the Card component.

You are free to refactor the starter code where it improves the solution.

## Submission

Please commit as you go in the Git repository you created above. **Your submission must include the full Git history** — we are interested in how you approached the task, not only in the final result.

Submit in one of two ways:

- **Git link:** push the repository to a hosting service of your choice (e.g. GitHub, GitLab) and send us the link. If the repository is private, please grant us access.
- **ZIP archive:** zip the repository folder **including the `.git` directory** and **without `node_modules`**. Note that `git archive` and GitHub's "Download ZIP" do not include the history, so please zip the folder itself, for example:

  ```bash
  zip -r submission.zip . -x "node_modules/*" "dist/*" ".angular/*"
  ```

We should be able to run it with `npm install`, `npm start`, and the test command above.
