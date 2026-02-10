# AGENTS.md - Development Guide

## 📋 Project Overview

**ermnvldmr.com** is Vladimir Eremin's personal ecosystem of services delivered through a modern monorepo architecture. The project encompasses personal websites, documentation sites, and shared infrastructure for web-based content and services.

### Monorepo Architecture

- **Repository Structure**: pnpm workspace monorepo
- **Package Manager**: pnpm v9.12.3+
- **Core Technology**: TypeScript (Strict mode)
- **Services**: Independent web services with shared dependencies
- **Packages**: Reusable configurations and component libraries
- **Build System**: Distributed builds with dependency management
- **CI/CD**: GitHub Actions with path-based triggers

### Design Philosophy

- **Component-First**: All UI elements developed as isolated, reusable components
- **Configuration Sharing**: Centralized tooling configurations across services
- **TypeScript-First**: Strict typing for all public APIs and components
- **Documentation-Driven**: TSDoc required for all exported elements
- **Dependency Isolation**: Clear separation between packages and services
- **Build Optimization**: Efficient dependency building and caching

## 🏗️ Repository Structure

```
├── packages/                   # Shared packages and configurations
│   ├── eslint-config/         # Shared ESLint configurations
│   ├── jest-config/           # Shared Jest configurations
│   ├── storybook-config/      # Shared Storybook configurations
│   ├── vite-config/           # Shared Vite configurations
│   ├── stl/                   # Standard Type Library (utilities)
│   └── ui/                    # Shared React component library
├── services/                   # Independent web services
│   ├── www/                   # Main website (Astro + React)
│   └── docs/                  # Documentation site (Hugo)
├── .github/workflows/         # CI/CD automation
├── pnpm-workspace.yaml        # Workspace configuration
└── [root config files]        # Global configurations
```

### Package Organization

#### Configuration Packages (`packages/`)

- **eslint-config**: Shared ESLint rules for TypeScript, React, and Astro
- **jest-config**: Shared Jest configurations for different project types
- **storybook-config**: Shared Storybook setup and configurations
- **vite-config**: Shared Vite configurations for library builds

#### Library Packages (`packages/`)

- **stl** (Standard Type Library): Common utilities, types, and helper functions
- **ui**: React component library with design system and Storybook stories

#### Service Packages (`services/`)

- **www**: Main website built with Astro.js, React, and Tailwind CSS
- **docs**: Documentation site built with Hugo and Hextra theme

### Key Directory Rules

#### `/packages/`

- **Purpose**: Shared configurations and reusable libraries
- **Dependencies**: Can depend on each other following build order (configs → stl → ui)
- **Exports**: Must provide proper TypeScript declarations
- **Building**: Required before dependent services can build
- **Testing**: Individual test suites for each package

#### `/services/`

- **Purpose**: Independent web applications and sites
- **Dependencies**: Can consume packages but not other services
- **Deployment**: Independent deployment pipelines
- **Development**: Can be developed and tested in isolation
- **Configuration**: Inherit from shared packages but can override

## 🛠️ Development Workflow

### Monorepo Development Principles

- **Root-Level Scripts**: Check `package.json` at repository root for monorepo-wide operations
- **Service-Specific Scripts**: Each service in `services/` has its own development commands
- **Package Filtering**: Use pnpm workspace filtering to target specific packages/services
- **Dependency-Aware Building**: UI components must be built before dependent services

### Package Development Workflow

The monorepo follows a strict dependency hierarchy that must be respected:

#### 1. Configuration Packages First

Configuration packages provide shared tooling setups and must be built before anything else. Look for packages ending in `-config` in the `packages/` directory.

#### 2. Library Packages

Library packages (`stl`, `ui`) provide reusable code and components. They depend on configuration packages and must be built in dependency order (check their `package.json` dependencies).

#### 3. Services

Services consume packages but are independent of each other. They can be developed and deployed separately. Check `services/` directory for available services and their individual `package.json` files for available scripts.

### Code Organization Principles

- **Dependency Order**: configs → stl → ui → services
- **Single Responsibility**: Each package serves one clear purpose
- **Explicit Dependencies**: All inter-package dependencies declared in package.json
- **Build Isolation**: Each package can be built independently
- **Configuration Inheritance**: Services inherit from shared configurations

## 📝 Coding Conventions

### Package Naming Convention

All packages use the `@ermnvldmr/` namespace:

- `@ermnvldmr/eslint-config` - Shared ESLint configurations
- `@ermnvldmr/jest-config` - Shared Jest configurations
- `@ermnvldmr/storybook-config` - Shared Storybook configurations
- `@ermnvldmr/vite-config` - Shared Vite configurations
- `@ermnvldmr/stl` - Standard Type Library
- `@ermnvldmr/ui` - Component library
- `@ermnvldmr/www` - Main website service
- `@ermnvldmr/docs` - Documentation service

### TypeScript Guidelines

- **Strict Mode**: All TypeScript strict checks must pass
- **No 'any'**: The use of `any` is strictly prohibited. Use `unknown` if the type is truly unknown, or define proper generic constraints.
- **No 'ts-ignore' or 'ts-expect-error'**: Never suppress compiler errors. If a third-party library has missing types, provide a local declaration file (.d.ts) instead.
- **No Unsafe Assertions**: Avoid `as any` or `as T` assertions. Prefer type guards, `instanceof` checks, or proper schema validation (e.g., Zod) to narrow types.
- **Explicit Types**: Avoid type inference for public APIs; prefer explicit type definitions for exports.
- **Interface First**: Use interfaces for component props and public APIs.
- **Cross-Package Types**: Export types from packages for service consumption.

### TSDoc Documentation Requirements

**MANDATORY for all exported elements**: types, functions, constants, components

```typescript
/**
 * Combines class names using clsx and tailwind-merge for consistent styling.
 *
 * @param inputs - Class name inputs to combine
 * @returns Combined and deduplicated class string
 *
 * @example
 * \`\`\`typescript
 * cn('px-4 py-2', 'bg-blue-500', 'px-6') // 'py-2 bg-blue-500 px-6'
 * cn('text-lg', condition && 'font-bold') // 'text-lg font-bold'
 * \`\`\`
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Component Development Patterns

#### UI Package Components

```typescript
/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** The button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Versatile button component with multiple variants and sizes.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `NavigationMenu.tsx`)
- **Utilities**: camelCase (e.g., `cn.ts`, `formatters.ts`)
- **Constants**: UPPER_SNAKE_CASE for exports (e.g., `API_ENDPOINTS`)
- **Types**: PascalCase with descriptive suffixes (e.g., `ButtonProps`, `ApiResponse`)
- **Config Files**: kebab-case (e.g., `jest-config`, `eslint-config`)

### Module Structure Patterns

#### Package Structure

```
packages/ui/
├── src/
│   ├── components/           # Component categories
│   │   ├── generic/         # Layout and generic components
│   │   └── paper/           # Themed component variants
│   ├── styles/              # Global styles and CSS
│   ├── test-utils.tsx       # Testing utilities
│   └── index.ts            # Main package exports
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .storybook/             # Storybook configuration
```

#### Service Structure (www example)

```
services/www/
├── src/
│   ├── layouts/            # Astro layout components
│   ├── pages/              # Astro pages (file-based routing)
│   ├── shared/             # Shared utilities and constants
│   └── global.css          # Service-specific styles
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json
└── tailwind.config.mjs     # Tailwind configuration
```

## 🎨 Design System (UI Package)

### Component Organization

- **Generic Components**: Layout utilities (Stack, VStack, HStack)
- **Themed Components**: Paper-themed variants with consistent styling
- **Radix Integration**: Accessibility-first components using Radix UI
- **Storybook Stories**: Every component has comprehensive documentation

### Styling Approach

- **Tailwind CSS v4+**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe variant generation
- **Custom Design Tokens**: Consistent spacing, colors, typography
- **Responsive Design**: Mobile-first responsive patterns

### Component Categories

```typescript
// Generic Layout Components
export { Stack } from './components/generic/Stack/Stack';
export { VStack } from './components/generic/VStack/VStack';
export { HStack } from './components/generic/HStack/HStack';

// Themed Components (Paper)
export { Button } from './components/paper/PaperButton/Button';
export { Separator } from './components/paper/PaperSeparator/Separator';
```

## ⚙️ Configuration Management

### Shared Configurations

Each configuration package provides standardized setups:

#### ESLint Configuration

```javascript
// Provides: base, react, astro configurations
import { base } from '@ermnvldmr/eslint-config';
import { react } from '@ermnvldmr/eslint-config/react';
import { astro } from '@ermnvldmr/eslint-config/astro';
```

#### Jest Configuration

```typescript
// Provides: base, react configurations
import { base } from '@ermnvldmr/jest-config/base';
import { react } from '@ermnvldmr/jest-config/react';
```

#### Vite Configuration

```typescript
// Provides: library build configurations
import { defineLibConfig } from '@ermnvldmr/vite-config/lib';
```

### Service Configuration Inheritance

Services inherit from shared configs but can override:

```typescript
// In service package.json devDependencies
"@ermnvldmr/eslint-config": "workspace:*"
"@ermnvldmr/jest-config": "workspace:*"
```

## 🚀 Build & Deployment

### Build Dependencies

The monorepo must respect a strict build order due to package dependencies:

1. **Configuration packages** (eslint-config, jest-config, etc.) - Foundation tooling
2. **STL package** - Shared utilities and types
3. **UI package** - Component library (depends on STL)
4. **Services** - Applications that consume packages (www, docs)

### CI/CD Pipeline Structure

The repository uses path-based CI/CD triggers - each package and service has dedicated workflows in `.github/workflows/`. Examine the workflow files to understand:

- **Trigger Patterns**: Which file changes activate each pipeline
- **Build Dependencies**: How packages are built in sequence
- **Quality Gates**: Linting, type-checking, and testing requirements
- **Deployment Targets**: Where each service is deployed

## 🔧 Development Environment

### Prerequisites

- **Node.js**: v20+
- **pnpm**: v9.12.3+
- **TypeScript**: v5.8+
- **Hugo**: v0.110.0+ (for docs service)

### Initial Setup

To start development, follow the dependency hierarchy:

1. **Install dependencies** using the root `package.json` scripts
2. **Build configuration packages** first (check packages ending in `-config`)
3. **Build library packages** in dependency order (STL before UI)
4. **Start services** after dependencies are built

### Development Commands

The monorepo provides scripts at multiple levels:

- **Root Level**: Check root `package.json` for monorepo-wide operations
- **Package Level**: Each package has its own build, test, and development scripts
- **Service Level**: Services have development servers, build commands, and testing

Use pnpm workspace filtering (`--filter`) to target specific packages or services. Examine individual `package.json` files to discover available scripts for each component.

## 🧪 Testing Strategy

### Testing Framework Distribution

- **Shared Configuration**: Jest configs in `@ermnvldmr/jest-config`
- **Package Testing**: Each package has its own test suite
- **Service Testing**: Services test their specific functionality
- **Component Testing**: UI package uses React Testing Library
- **Storybook Testing**: Visual regression and interaction testing

### Test Organization

```typescript
// Package-level testing (packages/stl/src/functions/cn/cn.test.ts)
describe('cn function', () => {
  it('combines class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });
});

// Component testing (packages/ui/src/components/paper/Button/Button.test.tsx)
describe('components/paper/Button/Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="destructive">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('destructive');
  });
});
```

### Coverage Strategy

- **Package Coverage**: Individual coverage reports per package
- **Service Coverage**: Service-specific coverage including Storybook tests
- **Aggregated Coverage**: Combined reporting for the entire monorepo

---

_This guide serves as the architectural foundation for the monorepo. Focus on these stable patterns and structures rather than specific implementation details that may change over time._
