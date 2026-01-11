# AGENTS.md - Development Guide

## 📋 Project Overview

**www.ermnvldmr.com** is Vladimir Eremin's personal website built with modern web technologies. The project serves as a platform for sharing thoughts, creations, and personal content through a carefully crafted design system.

### Core Architecture
- **Framework**: Astro.js v5+ (Static Site Generator)
- **UI Library**: React 19+ (Islands Architecture)
- **Styling**: Tailwind CSS v4+ with custom design system
- **Language**: TypeScript (Strict mode)
- **Build Tool**: Vite 7+
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages with automated CI/CD

### Design Philosophy
- **Component-First**: All UI elements are developed as isolated, reusable components
- **Design System**: Custom "rainby" color palette with consistent theming
- **Performance-First**: Static generation with minimal JavaScript islands
- **TypeScript-First**: Strict typing for all public APIs and components
- **Documentation-Driven**: TSDoc required for all exported elements

## 🏗️ Directory Structure

```
├── src/
│   ├── components/              # React component library
│   │   ├── shared/             # Common reusable components
│   │   └── {theme_name}/       # Theme-specific components
│   ├── www/                    # Astro application (custom srcDir)
│   │   ├── layouts/            # Page layout templates (.astro)
│   │   ├── pages/              # File-based routing (.astro)
│   │   ├── shared/             # Utilities and constants
│   │   └── widgets/            # Feature-specific components
│   └── global.css              # Design system + Tailwind configuration
├── content/                    # Astro Content Collections
│   └── {collections}/          # Blog posts, articles, etc.
├── .storybook/                 # Component development environment
├── .github/workflows/          # CI/CD automation
├── public/                     # Static assets
└── [config files]              # Various configuration files
```

### Key Directory Rules

#### `/src/components/`
- **Purpose**: Reusable React components developed in isolation
- **Structure**: Organized by usage scope (`shared/` for common, `{theme}/` for themed)
- **Requirements**: All components must have Storybook stories
- **Exports**: Only manually developed components, no external UI library dependencies

#### `/src/www/`
- **Purpose**: Astro application code (set as custom srcDir in config)
- **Constraint**: Only use manually developed components from `/src/components/`
- **Organization**: Standard Astro structure with layouts, pages, and utilities

#### `/src/www/widgets/`
- **Purpose**: Feature-specific components tied to particular functionality
- **Usage**: Components that don't fit in shared or themed categories

#### `/content/`
- **Purpose**: Content management using Astro Content Collections
- **Structure**: Organized by content type (blog, projects, etc.)
- **Format**: Markdown/MDX files with frontmatter validation

## 🛠️ Development Workflow

### Component Development
1. **Storybook-First**: All components must be developed and tested in Storybook
2. **Isolation**: Components should work independently without page context
3. **Documentation**: Each component requires comprehensive Storybook stories
4. **Manual Development**: No external UI library components in `/src/www/`

### Code Organization Principles
- **Single Responsibility**: Each component serves one clear purpose
- **Composition Over Inheritance**: Build complex UIs by composing simple components
- **TypeScript-First**: All public APIs must be properly typed
- **Documentation-Required**: TSDoc for all exported elements

## 📝 Coding Conventions

### TypeScript Guidelines
- **Strict Mode**: All TypeScript strict checks must pass
- **Explicit Types**: Avoid `any` and prefer explicit type definitions
- **Interface First**: Use interfaces for component props and public APIs
- **Generic Constraints**: Properly constrain generic types

### TSDoc Documentation Requirements
**MANDATORY for all exported elements**: types, functions, constants, components

```typescript
/**
 * Formats a date string or timestamp into human-readable format.
 * 
 * @param input - The date to format (string or number timestamp)
 * @returns Formatted date string in "Month Day, Year" format
 * 
 * @example
 * \`\`\`typescript
 * formatDate('2024-01-15') // "January 15, 2024"
 * formatDate(1705276800000) // "January 15, 2024"
 * \`\`\`
 */
export function formatDate(input: string | number): string {
  // implementation
}

/**
 * Props for the PageHead component.
 */
export interface PageHeadProps {
  /** The main title displayed in the header */
  title: string;
  /** Array of breadcrumbs, displayed above the title */
  breadcrumbs?: Breadcrumb[];
  /** Navigation items displayed on the right */
  navItems?: NavItem[];
}
```

### React Component Patterns
- **Functional Components**: Use function declarations with explicit typing
- **Props Interfaces**: Define props as separate interfaces with TSDoc
- **Memo Usage**: Wrap components with `memo()` for performance when appropriate
- **Event Handlers**: Type event handlers explicitly

```typescript
/**
 * A reusable button component with consistent styling and behavior.
 */
export interface ButtonProps {
  /** The button text content */
  children: React.ReactNode;
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Button component following the design system patterns.
 */
export const Button = memo(function Button({ 
  children, 
  onClick, 
  variant = 'primary' 
}: ButtonProps) {
  // implementation
});
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `PageHead.tsx`, `NavigationMenu.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiHelpers.ts`)
- **Constants**: UPPER_SNAKE_CASE for exports (e.g., `SITE_TITLE`)
- **Types**: PascalCase with descriptive suffixes (e.g., `ButtonProps`, `ApiResponse`)

### Module Structure Patterns

Each module in the project follows a consistent internal structure to maintain organization and scalability.

#### Component Modules
For widgets and shared components:

```
src/widgets/SomeComponent/
├── hooks/
│   └── someHook/ 
│       └── someHook.tsx
├── helpers/
│   └── someHelper/
│       └── someHelper.ts 
├── components/
│   └── SomeSubComponent/
│       └── SomeSubComponent.tsx
├── SomeComponent.tsx
├── SomeComponent.test.tsx (if needed)
└── SomeComponent.stories.tsx
```

#### Shared Helper Modules
For standalone utility functions:

```
src/shared/helpers/someHelper/
├── helpers/
│   └── someSubHelper/
│       └── someSubHelper.ts 
├── someHelper.ts
└── someHelper.test.ts
```

#### Shared Hook Modules
For reusable React hooks:

```
src/shared/hooks/someHook/
├── hooks/
│   └── someSubHook/
│       └── someSubHook.ts
├── someHook.ts
└── someHook.test.ts
```

#### Module Organization Rules

1. **Single Entry Point**: Each module exports its main functionality from the root file
2. **Internal Dependencies**: Sub-modules (helpers/, hooks/, components/) are implementation details
3. **Testing Strategy**: Test only the final exported component/function, not internal dependencies
4. **Story Strategy**: Create Storybook stories only for the main exported component
5. **Naming Consistency**: Directory names match the main export name
6. **Isolation**: Each module should be self-contained and independently testable

#### Testing Guidelines

- **Focus on Public API**: Test the main exported functionality, not internal helpers
- **Integration Over Unit**: Test how the complete module works, not individual pieces
- **Story-Driven Testing**: Use Storybook stories as living documentation and manual testing
- **Avoid Over-Testing**: Don't create separate tests for internal sub-modules

#### Import/Export Patterns

```typescript
// Main module file (SomeComponent.tsx)
import { someHelper } from './helpers/someHelper/someHelper';
import { useSomeHook } from './hooks/someHook/someHook';
import SomeSubComponent from './components/SomeSubComponent/SomeSubComponent';

// Export only the main component
export default SomeComponent;
export type { SomeComponentProps };
```

## 🎨 Design System

### Color Palette
The project uses a custom "rainby" color palette with semantic color mapping:
- **Core Colors**: Red, Orange, Yellow, Green, Cyan, Blue, Violet, Neutral
- **Each Color**: 50-950 scale following Tailwind conventions
- **Semantic Mapping**: Primary (cyan), Secondary (green), Accent (violet), etc.

### Theme Structure
```css
:root {
  /* Light mode variables */
  --color-background: var(--color-rainby-neutral-50);
  --color-foreground: var(--color-rainby-neutral-950);
  /* ... */
}

.dark {
  /* Dark mode overrides */
  --color-background: var(--color-rainby-neutral-950);
  --color-foreground: var(--color-rainby-neutral-50);
  /* ... */
}
```

### Custom Utilities
- **`frosted-glass`**: Backdrop blur effect for overlays
- **`vstack`**: Vertical flex layout utility
- **`hstack`**: Horizontal flex layout utility

### Typography
- **Sans**: Lato (headings, UI text)
- **Serif**: EB Garamond (body text, content)
- **Responsive**: Tailwind responsive typography classes

## ⚙️ Configuration Files

### Path Mapping (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@*": ["./src/*"]
    }
  }
}
```

### Astro Configuration
- **Custom srcDir**: `./src/www` (Astro application code)
- **Integrations**: MDX, Sitemap, React
- **Vite Plugins**: Tailwind CSS integration

### Development Tools
- **ESLint**: Astro + React + TypeScript configurations
- **Prettier**: Astro + React + Tailwind plugins
- **Storybook**: React-Vite with Tailwind integration

## 🚀 Build & Deployment

### Scripts
```json
{
  "dev": "astro dev",          // Development server
  "build": "astro build",      // Production build
  "preview": "astro preview",  // Preview built site
  "storybook": "storybook dev", // Component development
  "check": "lint + typecheck"  // Code quality checks
}
```

### CI/CD Pipeline
1. **Semantic Release**: Automated versioning and changelog generation
2. **GitHub Actions**: Automated build and deployment to GitHub Pages
3. **Quality Gates**: ESLint, TypeScript checking, build verification

### Release Process
- **Branches**: `next` (prerelease), `release/*` (stable releases)
- **Triggers**: Release creation automatically deploys to production
- **Versioning**: Semantic versioning with conventional commits

## 📚 Content Management

### Astro Content Collections
Content is managed through Astro's Content Collections system in the `/content/` directory:
- **Type Safety**: Schema validation for frontmatter
- **Organization**: Content organized by collection type
- **Processing**: Automatic type generation and content APIs

### Content Structure Example
```
content/
├── blog/           # Blog posts
│   ├── post-1.md
│   └── post-2.mdx
└── projects/       # Project showcases
    ├── project-1.md
    └── project-2.md
```

## 🔧 Development Environment

### Prerequisites
- **Node.js**: v20+
- **pnpm**: v9.12.3+
- **TypeScript**: v5.8+

### Setup Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm storybook        # Start component development
pnpm check            # Run all quality checks
```

### Development Guidelines
1. **Component-First**: Develop components in Storybook before integration
2. **Type Safety**: All public APIs must be properly typed with TSDoc
3. **Manual Components**: Only use manually developed components in www
4. **Design System**: Follow the established color palette and utilities
5. **Performance**: Leverage Astro's static generation with minimal client-side JavaScript
6. **Testing**: Write tests for utilities, hooks, and interactive components

## 🧪 Testing Strategy

### Testing Framework
- **Test Runner**: Jest with TypeScript support
- **Component Testing**: React Testing Library for component interactions
- **Utilities**: Jest for unit testing of pure functions and hooks
- **Coverage**: HTML and LCOV reports for coverage tracking

### Testing Patterns

#### Component Testing
```typescript
import { render, screen } from '@/test/test-utils';
import { SomeComponent } from './SomeComponent';

/**
 * Test suite for SomeComponent
 */
describe('SomeComponent', () => {
  const defaultProps = {
    title: 'Test Title',
  };

  it('renders correctly', () => {
    render(<SomeComponent {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

#### Utility Testing
```typescript
import { someUtility } from './someUtility';

/**
 * Test suite for utility functions
 */
describe('someUtility', () => {
  it('handles expected inputs correctly', () => {
    expect(someUtility('input')).toBe('expected');
  });

  it('handles edge cases', () => {
    expect(someUtility('')).toBe('');
  });
});
```

### Testing Commands
```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

### Testing Guidelines
- **Focus on Public API**: Test exported functionality, not implementation details
- **Module-Level Testing**: Test the main export of each module, not sub-dependencies
- **Integration Over Unit**: Test how complete modules work together
- **Accessibility Testing**: Use screen reader queries and accessibility matchers
- **User-Centric**: Test from the user's perspective (what they see and interact with)

### Naming Conventions for Tests and Stories
- **Test describe blocks**: Use full component path format: `components/paper-kit/ComponentName/ComponentName`
- **Storybook titles**: Use full component path format: `components/paper-kit/ComponentName`
- **Consistency**: Both tests and stories should use the same path-based naming for organization

Example:
```typescript
// In Component.test.tsx
describe('components/paper-kit/Button/Button', () => {
  // tests
});

// In Component.stories.tsx
const meta: Meta<typeof Component> = {
  title: 'components/paper-kit/Button',
  component: Component,
};
```

---

*This guide serves as the architectural foundation for the project. Focus on these stable patterns and structures rather than specific implementation details that may change over time.*
