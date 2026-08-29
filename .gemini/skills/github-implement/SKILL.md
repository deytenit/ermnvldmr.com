---
name: github-implement
description: Implement code changes from an approved issue plan, run monorepo validation, and create a pull request.
---

# GitHub Implement Skill

Use this skill when an issue receives the `/implement` command.

## Overview

This skill guides the implementation of approved design plans. It enforces repository rules, executes automated validation, and prepares pull requests for the `next` branch.

## Procedural Workflow

### Phase 1: Context Ingestion

1. Read the complete issue description and title.
2. Locate the approved implementation plan in the issue comments.
3. Parse additional instructions from the `/implement` comment.
4. If requirements conflict or miss critical details, stop and request clarification.

### Phase 2: Code Implementation

Apply all modifications according to `GEMINI.md` conventions:

1. **TypeScript Constraints**:
   - Enable strict typing for all new code.
   - Do not use the `any` type.
   - Do not use type assertions (`as Type`).
   - Do not use the non-null assertion operator (`!`).
   - Use explicit type guards or helper functions such as `castRef`.
   - Use `import type` for type-only imports.
   - Define object structures with `interface`, not `type` aliases.

2. **Documentation Rules**:
   - Add JSDoc comments to all exported functions, interfaces, and types.
   - Include clear description text in every JSDoc block.

3. **Component Architecture**:
   - Place components in dedicated directories under `packages/ui/src/components/<ComponentName>/`.
   - Provide `<ComponentName>.tsx` for component logic.
   - Provide `<ComponentName>.stories.tsx` for Storybook stories.
   - Provide `<ComponentName>.test.tsx` for Vitest tests.
   - Use `cva` for component variant management.
   - Merge CSS utility classes with `cn(...)` from `@ermnvldmr/stl`.
   - Use React Aria hooks and Radix UI primitives for accessible controls.

4. **Monorepo Imports and State**:
   - Use relative paths within the same package.
   - Do not use self-referential package names.
   - Use standard React state primitives. Do not add unapproved state managers.

5. **Protected Boundaries**:
   - Do not modify `.env.keys`, `pnpm-lock.yaml`, or `LICENSE`.
   - Do not edit content files in `services/docs/content/` or `services/www/content/` unless explicitly instructed.

### Phase 3: Monorepo Verification & Self-Correction

Run validation commands in strict sequence:

1. Run `pnpm typecheck`. Ensure zero compiler errors.
2. Run `pnpm lint`. Ensure zero warnings and zero errors.
3. Run `pnpm test`. Ensure all unit and component tests pass.
4. Run `pnpm build`. Ensure clean compilation across all packages.

**Iterative Self-Correction Loop**:
- If any check fails, inspect the diagnostic output.
- Identify the root cause.
- Apply targeted fixes adhering to all code rules.
- Re-run the verification sequence from step 1.
- Repeat until all four checks pass completely.

### Phase 4: Commit & Pull Request Preparation

1. **Commit Message**:
   - Format commits according to Conventional Commits: `<type>: implement issue #<number> (<title>)`.
   - Example: `feat: implement issue #42 (add theme toggle)`.

2. **Pull Request Target**:
   - Set base branch to `next`.

3. **Pull Request Body**:
   - Link the issue: `Resolves #<number>`.
   - Provide a concise summary of changes.
   - Detail the implementation walkthrough.
   - List the executed verification checks.
   - Append the mandatory attribution line.

4. **Mandatory Attribution**:
   - Conclude all PR bodies and issue comments with:
     `Disclosure: I'm an AI assistant helping deytenit; I'm not deytenit.`

## Pull Request Template

```markdown
## Summary
Resolves #<number>

<Brief explanation of the implemented feature or fix>

## Walkthrough of Changes
- `<package-or-path>`: <Description of specific change>
- `<package-or-path>`: <Description of specific change>

## Verification Results
- [x] `pnpm typecheck` passed (0 errors)
- [x] `pnpm lint` passed (0 warnings)
- [x] `pnpm test` passed (all tests green)
- [x] `pnpm build` passed (clean build)

Disclosure: I'm an AI assistant helping deytenit; I'm not deytenit.
```

## Verification Checklist

- [ ] Issue context, approved plan, and user instructions are satisfied.
- [ ] TypeScript strict mode rules are respected (`no any`, `no as`, `no !`).
- [ ] Exported symbols include JSDoc comments.
- [ ] UI components reside in dedicated folders with tests and stories.
- [ ] Monorepo boundaries and relative imports are respected.
- [ ] All four verification checks passed cleanly.
- [ ] Target branch is set to `next`.
- [ ] PR description includes `Resolves #<number>`.
- [ ] Mandatory attribution line is present.
