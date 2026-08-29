---
name: github-plan
description: Analyze an issue thread, iterate on feedback, and produce or update an implementation plan for ermnvldmr.com.
---

# GitHub Issue Planning Skill (ASD-STE100 Standard)

## Overview

Use this skill when an issue receives the `/plan [optional instructions]` command.

This skill creates or updates an implementation plan before code modification starts. All outputs must follow ASD-STE100 language constraints and repository standards.

---

## ASD-STE100 Writing Rules

Follow these rules for all generated plans and documentation:

| Rule | Limit | Approved Example | Non-Approved Example |
| :--- | :--- | :--- | :--- |
| **Procedural Sentences** | Max **20 words** | "Run `pnpm test`. Verify that all unit tests pass." | "You should run the pnpm test command to verify that all the unit tests pass properly without errors." |
| **Descriptive Sentences** | Max **25 words** | "The `Button` component uses `cva` to manage style variants." | "The Button component is implemented using the cva library because it helps us manage complex style variants across different themes easily." |
| **Voice** | **Active voice** | "The function validates the user input." | "The user input is validated by the function." |
| **Mood and Tense** | **Present tense** and **Imperative mood** | "Click **Submit**. The form transmits the data." | "You will click submit and the form will be transmitting the data." |
| **Noun Clusters** | Max **3 nouns** | "Theme configuration file" | "Theme variant style configuration file" |

### Controlled Vocabulary Guidelines
- Do not use conversational filler (for example: "basically", "let's dive in", "simply", "feel free to").
- Use approved verbs: use *use* (not *utilize*), *stop* (not *terminate*), *start* (not *initiate*), *show* (not *exhibit*).
- Use clear and literal technical terms.

---

## Planning Responsibilities

### 1. Ingest Full Issue Context
- Read the issue title, issue description, and all subsequent comments.
- Identify user requirements, technical constraints, and reported symptoms.
- Inspect relevant source files in the repository before proposing changes.
- Read `GEMINI.md` to confirm current project conventions.

### 2. Multi-Turn Plan Iteration
- Check if an earlier implementation plan exists in the issue thread.
- If an earlier plan exists:
  - Do not create a plan from zero.
  - Retain approved architectural decisions from previous turns.
  - Apply the requested modifications or additions from the latest comment.
  - Summarize the specific adjustments made to the previous plan.
- If no earlier plan exists:
  - Create a new baseline implementation plan from the issue requirements.

### 3. Enforce Repository Architecture (`GEMINI.md`)
Every proposed plan must comply with repository architecture:
- **Build System**: Use Rsbuild and Rspack. Do not propose Vite, Webpack, or Next.js.
- **Strict TypeScript**:
  - Do not use `any`.
  - Do not use type assertions (`as Type`). Use type guards or `castRef` from `@ermnvldmr/stl`.
  - Do not use non-null assertions (`!`).
  - Use `import type` for type-only imports.
  - Define object shapes with `interface`, not `type` aliases.
  - Require JSDoc comments on all exported symbols.
- **Component Architecture** (`packages/ui`):
  - Place components in `packages/ui/src/components/<ComponentName>/`.
  - Provide `<ComponentName>.tsx`, `<ComponentName>.stories.tsx`, and `<ComponentName>.test.tsx`.
  - Use `cva` for variant definitions.
  - Merge class names with `cn(...)` from `@ermnvldmr/stl`.
- **Accessibility & State**:
  - Use React Aria hooks (`useButton`, `useFocusRing`, `useHover`) and Radix UI primitives.
  - Use standard React state (`useState`, `useReducer`, `useContext`) and `react-stately`.
  - Do not introduce external state management libraries.
- **Monorepo Import Rules**:
  - Use relative import paths within the same package.
  - Do not import `@ermnvldmr/<package>` inside `<package>` itself.
- **Protected Files**:
  - Do not modify `.env.keys`, `pnpm-lock.yaml`, `LICENSE`, `services/docs/content/`, or `services/www/content/`.

---

## Output Plan Structure

Format the generated plan with the following markdown template:

```markdown
### Goal
[Describe the objective in 1-2 sentences. Keep each sentence under 25 words.]

### Architecture & Technical Decisions
- [Decision 1: Explain pattern, primitive, or component structure.]
- [Decision 2: Explain typing or API contracts.]
- [Decision 3: Explain state management or accessibility integration.]

### File Changes
- `[NEW]` `packages/ui/src/components/NewComponent/NewComponent.tsx` - [Purpose]
- `[NEW]` `packages/ui/src/components/NewComponent/NewComponent.stories.tsx` - [Purpose]
- `[NEW]` `packages/ui/src/components/NewComponent/NewComponent.test.tsx` - [Purpose]
- `[MODIFY]` `packages/ui/src/index.ts` - [Export new component]

### Verification Plan
1. `pnpm typecheck` - Verify zero TypeScript compiler errors.
2. `pnpm lint` - Verify zero ESLint warnings and errors.
3. `pnpm test` - Run unit and integration tests.
4. `pnpm build` - Run full workspace build.

### Open Questions
- [List open questions or ambiguities. If no open questions exist, write "None.".]

Disclosure: I'm an AI assistant helping deytenit; I'm not deytenit.
```

---

## Common Traps and Solutions

| Anti-Pattern | Correct Action |
| :--- | :--- |
| Regenerating a new plan after user feedback | Update the existing plan and highlight modified sections. |
| Using `as Type` assertions in the proposed code | Propose explicit type guards or `castRef` helpers. |
| Missing Storybook or Vitest files for UI components | Include `.stories.tsx` and `.test.tsx` in the file plan. |
| Proposing external state libraries | Use React 19 primitives and `react-stately`. |
| Omitting the attribution line | Append the mandatory disclosure line at the end. |

---

## Verification Checklist

Before posting the plan response, verify all items:

- [ ] The issue thread context and all user comments are analyzed.
- [ ] Existing plans are updated rather than replaced from scratch.
- [ ] Proposed code satisfies all `GEMINI.md` constraints (`strict: true`, no `any`, no `as`, no `!`).
- [ ] All UI components include unit tests and Storybook stories.
- [ ] All sentences follow ASD-STE100 limits (<=20 words for instructions, <=25 words for descriptions).
- [ ] Active voice is used throughout the plan.
- [ ] The output concludes with: `Disclosure: I'm an AI assistant helping deytenit; I'm not deytenit.`

