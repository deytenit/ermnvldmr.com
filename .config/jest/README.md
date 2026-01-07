# Testing Configuration

The project uses Jest with a clean configuration structure located in `.config/jest/`:

```
.config/jest/
├── setup.ts           # Global test environment setup
├── test-utils.tsx     # Custom render utilities for React components
└── tsconfig.json      # TypeScript configuration for test files
```

## Setup Files

### `setup.ts`
Global test environment configuration including browser API mocks (IntersectionObserver, ResizeObserver, matchMedia) needed for testing React components in jsdom.

### `test-utils.tsx`
Custom render function with project-specific providers and configurations. Import this instead of `@testing-library/react` directly:

```typescript
import { render, screen } from '@test/test-utils';
import { MyComponent } from './MyComponent';

// Use the custom render function
render(<MyComponent />);
expect(screen.getByText('Hello')).toBeInTheDocument();
```

## Path Aliases

The Jest configuration includes a `@test/*` alias that maps to `.config/jest/`:

```typescript
// Import test utilities
import { render, screen } from '@test/test-utils';
```

This keeps test configuration separate from source code while maintaining clean imports.
