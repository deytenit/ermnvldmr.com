# AGENTS.md

Guidance and operational constraints for AI coding agents working on `ermnvldmr.com`.

## 1. System Overview & Tech Stack

`ermnvldmr.com` is a pnpm monorepo hosting personal web services, dividing applications into `services/` and shared packages into `packages/`. The primary website (`services/www`) and static pages (`services/static`) are built with React 19 and Rsbuild (Rspack). Build-time Static Site Generation is performed via `@ermnvldmr/ssg`, a custom Rsbuild plugin that pre-renders React entry points to HTML with inlined critical CSS (via Critters). The documentation service (`services/docs`) runs on Hugo with the Hextra theme.

Shared workspace packages provide the UI design system (`@ermnvldmr/ui`), application component kits (`@ermnvldmr/kits`), standard types library (`@ermnvldmr/stl`), localization utilities (`@ermnvldmr/i18n`), monorepo CLI tooling (`@ermnvldmr/cli`), static site generator (`@ermnvldmr/ssg`), and reusable presets for ESLint, Rsbuild, and Storybook. Design components utilize Tailwind CSS v4, Radix UI primitives, React-Aria, and CVA, validated using Vitest and Storybook 8.

| Technology | Version / Tool | Purpose |
| :--- | :--- | :--- |
| **Package Manager** | `pnpm` (>=9.12.3) | Workspace dependency and package management |
| **Runtime Engine** | Node.js (>=20) | Server and build runtime environment |
| **UI Library** | React 19 (`react`, `react-dom`) | Declarative UI rendering |
| **Bundler Engine** | Rsbuild / Rspack | Rust-powered bundling, hot module reloading, and build pipeline |
| **Static Site Generator** | `@ermnvldmr/ssg` / Hugo (>=0.110.0) | Build-time React HTML pre-rendering & Hugo docs engine |
| **UI Primitives & Icons** | React Aria, Radix UI, Lucide React | Accessible interactive primitives and icon system |
| **Styling & Utilities** | Tailwind CSS v4, CVA, `@ermnvldmr/stl` | Utility styling, component variant management, class utilities |
| **Internationalization** | `@ermnvldmr/i18n` | Multi-locale routing and localization strings (`en`, `ru`) |
| **Testing Framework** | Vitest, Testing Library, Playwright | Unit, integration, and Storybook interaction testing |
| **Component Workshop** | Storybook 8 | Isolated component development environment |
| **Static Analysis** | ESLint 9 (Flat Config), TypeScript 5.8 | Code linting, monorepo import boundary checks, strict typing |
| **Secrets Encryption** | `@dotenvx/dotenvx` | Public-key encrypted `.env.dev` secrets management |

## 2. Project Structure & Key Directories

```text
ermnvldmr.com/
├── ci/                      # CI/CD pipelines, Docker containers, deployment scripts
├── docs/                    # Architectural documentation and design specifications
├── packages/                # Monorepo shared packages and toolchain configurations
│   ├── cli/                 # Monorepo CLI utility (`ermnvldmr-cli`) for tasks like S3 asset sync
│   ├── eslint-config/       # Shared flat ESLint rule sets and monorepo import restriction rules
│   ├── i18n/                # Localization engine, locale pathing, and translation keysets
│   ├── kits/                # High-level domain & layout component kits (BentoGrid, InfoCard, PageHead, Page, etc.)
│   ├── rsbuild-config/      # Shared Rsbuild and Rspack bundler configuration presets
│   ├── ssg/                 # Build-time Static Site Generation plugin for Rsbuild React apps
│   ├── stl/                 # Standard Types Library for core utilities, type definitions, and react helpers
│   ├── storybook-config/    # Shared Storybook workshop configurations
│   └── ui/                  # Design system React component library, styles, and Storybook stories
├── services/                # Deployable web applications and services
│   ├── docs/                # Technical documentation site (Hugo + Hextra theme)
│   ├── static/              # Static landing pages service (Rsbuild + React 19)
│   └── www/                 # Primary website (Rsbuild + React 19 + MDX + SSG)
├── .env.dev                 # Encrypted environment variable storage (tracked in git)
├── .env.keys                # Private decryption keys (UNTRACKED - do not commit)
├── eslint.config.mjs        # Root ESLint flat configuration extending `@ermnvldmr/eslint-config`
├── pnpm-workspace.yaml      # Monorepo workspace package definitions
└── tsconfig.json            # Root TypeScript configuration with workspace path aliases
```

## 3. Setup & Commands

### CLI Commands

- **Install dependencies**: `pnpm install`
- **Development servers**:
  - Website (`services/www`): `pnpm www:dev` (or `pnpm dev:www`)
  - Documentation (`services/docs`): `pnpm docs:dev` (or `pnpm dev:docs`)
  - UI Component Storybook (`packages/ui`): `pnpm ui:storybook`
  - Static landings (`services/static`): `pnpm static:dev` (or `pnpm dev:static`)
  - UI package build watcher: `pnpm ui:dev`
- **Build**:
  - Full workspace build: `pnpm build`
  - Workspace package dependencies only: `pnpm build:deps`
  - Individual package build: `pnpm --filter @ermnvldmr/ui build`
- **Linting & Formatting**:
  - Lint workspace: `pnpm lint`
  - Typecheck workspace: `pnpm typecheck`
  - Format files: `pnpm format`
- **Testing**:
  - Run full test suite: `pnpm test`
  - Test single package: `pnpm --filter @ermnvldmr/ui test`
  - Test single file: `pnpm --filter @ermnvldmr/ui exec vitest run src/components/Button/Button.test.tsx`
  - Test coverage: `pnpm test:coverage`

### Environment Setup

- Environment variables are managed using `@dotenvx/dotenvx`.
- `.env.dev` contains encrypted values and is tracked in git.
- `.env.keys` contains local decryption keys (`DOTENV_PRIVATE_KEY`) and must never be committed.
- Environment variables:
  - `LOCALE`: Target build language (`en` or `ru`, defaults to `en`).
  - `RSDOCTOR`: Set `RSDOCTOR=true` during build to trigger Rsbuild bundle analysis.
  - S3 static sync credentials: `COM_ERMNVLDMR_STATIC_S3_BUCKET`, `COM_ERMNVLDMR_STATIC_S3_REGION`, `COM_ERMNVLDMR_STATIC_S3_ENDPOINT_URL`, `COM_ERMNVLDMR_STATIC_AWS_ACCESS_KEY_ID`, `COM_ERMNVLDMR_STATIC_AWS_SECRET_ACCESS_KEY`.

## 4. Non-Negotiable Coding Rules & Patterns

### Typing & Documentation Rules

- **Strict TypeScript**: `strict: true` is enforced globally.
- **Forbidden Types**: `any` is strictly prohibited (`@typescript-eslint/no-explicit-any: error`).
- **Forbidden Assertions**: Type assertions (`as Type`) are strictly prohibited (`@typescript-eslint/consistent-type-assertions: ['error', { assertionStyle: 'never' }]`). Use explicit type guards or type casting helpers (e.g., `castRef` from `@ermnvldmr/stl`).
- **Forbidden Non-Null Assertion**: Non-null assertion operator (`!`) is prohibited (`@typescript-eslint/no-non-null-assertion: error`).
- **Explicit Type Imports**: Imports used strictly for types MUST use `import type` (`@typescript-eslint/consistent-type-imports: error`).
- **Interface Definitions**: Object shapes MUST use `interface`, not `type` aliases (`@typescript-eslint/consistent-type-definitions: ['error', 'interface']`).
- **TSDoc Requirements**: JSDoc comments are required on all exported function declarations, interfaces, and type declarations (`jsdoc/require-jsdoc: error`). A description string is mandatory (`jsdoc/require-description: error`).

### Component Architecture & Structure

- Component implementations in `packages/ui` MUST live in dedicated PascalCase subdirectories:
  `packages/ui/src/components/<ComponentName>/`
  - `<ComponentName>.tsx` — Component logic and JSX
  - `<ComponentName>.stories.tsx` — Storybook stories
  - `<ComponentName>.test.tsx` — Vitest unit tests
- **Styling**: Component variant logic must use `cva` (class-variance-authority). Utility class merging must use `cn(...)` from `@ermnvldmr/stl`.
- **Accessibility**: Interactive elements must leverage `react-aria` hooks (`useButton`, `useFocusRing`, `useHover`) to maintain accessibility standards.
- **Naming Conventions**:
  - PascalCase for React component files and directories (`Button/Button.tsx`).
  - camelCase for helper modules, hooks, and utilities (`path.ts`, `useTheme.ts`).
  - kebab-case for configuration files (`eslint.config.mjs`, `postcss.config.mjs`).

### State Management & Import Rules

- **State Primitives**: Use standard React state (`useState`, `useReducer`, `useContext`) and `react-stately` / `react-aria` primitives. Do not introduce unapproved third-party state managers.
- **Monorepo Relative Imports**: Code inside a package or service MUST use relative paths when referencing files within that same package. Importing the package's own published name inside itself (e.g. `import ... from '@ermnvldmr/ui'` inside `packages/ui`) is strictly prohibited and fails ESLint checks.

### Anti-Patterns ("What NOT to do")

- **DO NOT** use `any`, `as Type` assertions, or `!` non-null assertions.
- **DO NOT** introduce Vite, Webpack, or Next.js configurations. Rsbuild (Rspack) is the monorepo's standardized React bundler.
- **DO NOT** use self-referential package imports within workspace packages; use relative paths.
- **DO NOT** suppress linter or compiler errors with `@ts-ignore`, `@ts-nocheck`, or inline eslint disables without explicit user approval.
- **DO NOT** commit unencrypted `.env` files or secret keys (`.env.keys`).
- **DO NOT** run `git commit` or execute automated git commits under any circumstances.

## 5. Critical Workflows & Safety Directives

### Verification Workflow

Before completing any task, run and pass every step in the following sequence:

1. `pnpm typecheck` — 0 TypeScript compiler errors.
2. `pnpm lint` — 0 ESLint warnings (`--max-warnings 0`).
3. `pnpm test` — All unit and component tests passing.
4. `pnpm build` — Clean workspace compilation.

### Protected Boundaries

The agent MUST NOT modify the following files or directories unless explicitly requested by the user:

- `.env.keys` (untracked decryption keys).
- `pnpm-lock.yaml` (dependencies must be managed exclusively through `pnpm` CLI commands).
- `LICENSE` file.
- `ci/` deployment configurations, Dockerfiles, and GitHub Actions workflows.
- `services/docs/content/` and `services/www/content/` creative and literary works.
