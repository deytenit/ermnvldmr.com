---
name: github-fix
description: Diagnose CI failures and review feedback on GitHub Pull Requests or Issues, repair code, verify quality checks, and commit changes.
---

# GitHub Fix Skill

Use this skill when a user submits a `/fix` command on a GitHub Pull Request or Issue.

## Overview

The `/fix` command resolves build failures, test errors, and reviewer feedback. This skill enforces unified diagnosis, clean code repair, strict verification, and transparent progress reporting.

```text
/fix [optional instructions]
  │
  ├── 1. Unified Diagnosis (Fetch CI logs, inspect diff, parse comments)
  ├── 2. Target Code Repair (Fix build errors and review feedback in one pass)
  ├── 3. Verification (Run typecheck, lint, and tests)
  ├── 4. Git Operations (Commit and push to the active branch)
  └── 5. Thread Summary (Post itemized comment with mandatory disclosure)
```

---

## Operational Workflow

### Step 1: Unified Diagnosis

Collect all diagnostic context before making code edits.

#### Case A: Pull Request Context
1. Identify the current PR number and branch:
   ```bash
   gh pr view --json number,headRefName,baseRefName
   ```
2. Fetch failed CI workflow logs:
   ```bash
   gh run view --log-failed
   ```
3. Inspect current changes in the PR:
   ```bash
   gh pr diff
   ```
4. Read all review comments and discussion threads:
   ```bash
   gh pr view --comments
   ```
5. Check inline review comments on specific files:
   ```bash
   gh api repos/{owner}/{repo}/pulls/{pull_number}/comments
   ```

#### Case B: Issue Context
1. Read the issue description and thread comments:
   ```bash
   gh issue view <issue-number> --comments
   ```
2. Extract error stack traces, reproduction steps, and user instructions.

---

### Step 2: Target Code Repair

Apply all necessary corrections in a single pass.

1. Address all failures from CI logs (TypeScript errors, linter violations, test failures).
2. Apply requested changes from code review comments.
3. Incorporate any optional user instructions provided with `/fix`.
4. Obey all repository conventions defined in `GEMINI.md`:
   - **Strict TypeScript**: Do not use `any`, `as Type` assertions, or non-null `!` assertions. Use `castRef` from `@ermnvldmr/stl` when casting DOM references.
   - **Type Imports**: Use `import type` for type declarations.
   - **Interfaces**: Define object contracts with `interface`, not `type` aliases.
   - **TSDoc**: Add descriptive JSDoc comments to all exported symbols and interfaces.
   - **Styling**: Use Tailwind CSS v4 and `cva`. Merge class names with `cn` from `@ermnvldmr/stl`.
   - **UI Primitives**: Use React Aria hooks and Radix UI primitives.
   - **Import Boundaries**: Use relative paths for files within the same workspace package.

---

### Step 3: Verification

Execute the complete verification sequence. All checks must pass with zero warnings or errors before proceeding.

```bash
# 1. Verify TypeScript types
pnpm typecheck

# 2. Verify ESLint rules
pnpm lint

# 3. Run unit and component tests
pnpm test
```

> [!IMPORTANT]
> If any check fails, resolve the failure immediately and rerun the verification sequence.

---

### Step 4: Git Operations

Stage, commit, and push the resolved changes to the active branch.

1. Stage modified and created files:
   ```bash
   git add <modified-files>
   ```
2. Commit with standard message:
   ```bash
   git commit -m "fix: apply review adjustments and CI fixes"
   ```
3. Push changes to the remote branch:
   ```bash
   git push origin HEAD
   ```

---

### Step 5: Post Summary Comment

Post an itemized summary comment to the GitHub PR or Issue thread.

1. Format the comment with the template below.
2. Submit the comment via GitHub CLI:
   - For a Pull Request:
     ```bash
     gh pr comment <pr-number> --body "<comment-body>"
     ```
   - For an Issue:
     ```bash
     gh issue comment <issue-number> --body "<comment-body>"
     ```

---

## GitHub Comment Template

```markdown
### Automated Fix Summary

I addressed the reported issues and review feedback.

#### Root Causes Identified
- **CI / Test Failure**: `<Brief description of the failure>`
- **Review Feedback**: `<Brief description of reviewer comments>`

#### Changes Applied
- `packages/<pkg>/src/...`: Fixed `<specific problem>`
- `services/<svc>/src/...`: Updated `<specific problem>`

#### Verification Results
- `pnpm typecheck` passed (0 errors).
- `pnpm lint` passed (0 warnings).
- `pnpm test` passed (all tests clean).

Disclosure: I'm an AI assistant helping deytenit; I'm not deytenit.
```

---

## Verification Checklist

Before completing the task, verify every item in this checklist:

- [ ] Failed CI logs inspected with `gh run view --log-failed`.
- [ ] PR diff and review comments retrieved and analyzed.
- [ ] Code repairs satisfy all requirements without introducing regressions.
- [ ] No `any`, `as Type`, or `!` operators introduced.
- [ ] `pnpm typecheck` completed with 0 errors.
- [ ] `pnpm lint` completed with 0 warnings.
- [ ] `pnpm test` completed with all tests passing.
- [ ] Changes committed and pushed to the active branch.
- [ ] Summary comment posted to the PR or Issue.
- [ ] Mandatory disclosure line included at the end of the comment.
