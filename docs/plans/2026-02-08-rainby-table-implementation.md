# Rainby Table Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a comprehensive, accessible, and composable set of Table components (Table, Thead, Tbody, Tr, Th, Td, Caption) and a specialized Cell layout primitive, adhering to the Rainby Design System.

**Architecture:**
A Compound Component pattern using React Context (`TableContext`) to propagate high-level style props (`density`, `variant`, `striped`) from the root `Table` to all child components. This ensures API cleanliness and visual consistency. The `Cell` component serves as a polymorphic layout helper for cell content.

**Tech Stack:** React, Tailwind CSS, TypeScript, `class-variance-authority` (or manual `cn` utility), `genericMemo` from internal STL.

---

### Task 1: Setup TableContext and Types

Define the context that will share styling configuration across the table sub-components.

**Files:**

- Create: `packages/ui/src/components/Table/TableContext.tsx`
- Create: `packages/ui/src/components/Table/types.ts`

**Step 1: Define shared types**
Create `packages/ui/src/components/Table/types.ts`.

```typescript
export type TableDensity = 's' | 'm' | 'l';
export type TableVariant = 'surface' | 'outline' | 'ghost';

export interface TableContextValue {
  density: TableDensity;
  variant: TableVariant;
  striped: boolean;
  hoverable: boolean;
}
```

**Step 2: Create Context**
Create `packages/ui/src/components/Table/TableContext.tsx`.

```typescript
import { createContext, useContext } from 'react';
import type { TableContextValue } from './types';

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within a Table component.');
  }
  return context;
};

export const TableProvider = TableContext.Provider;
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/Table/types.ts packages/ui/src/components/Table/TableContext.tsx
git commit -m "feat(ui): add TableContext and types"
```

---

### Task 2: Implement Table Container and Root Component

Implement `TableContainer` (wrapper) and `Table` (root element with Provider).

**Files:**

- Create: `packages/ui/src/components/Table/Table.tsx`
- Create: `packages/ui/src/components/Table/Table.test.tsx` (Basic render test)

**Step 1: Write minimal test**
Create `packages/ui/src/components/Table/Table.test.tsx`.

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, TableContainer } from './Table';

describe('Table', () => {
  it('renders correctly', () => {
    render(
      <TableContainer>
        <Table density="m">
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Step 2: Implement Components**
Create `packages/ui/src/components/Table/Table.tsx`.

```typescript
import React, { forwardRef } from 'react';
import { cn, castRef } from '@ermnvldmr/stl';
import { TableProvider } from './TableContext';
import type { TableContextValue } from './types';

// TableContainer
export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full overflow-auto rounded-md border border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
);
TableContainer.displayName = 'TableContainer';

// Table
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, Partial<TableContextValue> {
  stickyHeader?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({
    className,
    children,
    density = 'm',
    variant = 'surface',
    striped = false,
    hoverable = false,
    stickyHeader = false,
    ...props
  }, ref) => {
    const contextValue: TableContextValue = { density, variant, striped, hoverable };

    return (
      <TableProvider value={contextValue}>
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom text-sm',
            variant === 'ghost' && 'border-none',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </TableProvider>
    );
  }
);
Table.displayName = 'Table';
```

**Step 3: Run Test**
`npm test packages/ui/src/components/Table/Table.test.tsx`

**Step 4: Commit**

```bash
git add packages/ui/src/components/Table/Table.tsx packages/ui/src/components/Table/Table.test.tsx
git commit -m "feat(ui): implement Table and TableContainer components"
```

---

### Task 3: Implement Semantic Table Sections (Header, Body, Footer, Caption)

Simple wrappers that forward refs and apply minimal base styles.

**Files:**

- Modify: `packages/ui/src/components/Table/Table.tsx` (Add exports)
- Modify: `packages/ui/src/components/Table/Table.test.tsx` (Update test)

**Step 1: Extend Test**
Add check for caption and section roles in `packages/ui/src/components/Table/Table.test.tsx`.

**Step 2: Add Components to Table.tsx**
Append to `packages/ui/src/components/Table/Table.tsx`:

```typescript
// TableHeader
export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

// TableBody
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

// TableFooter
export const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

// TableCaption
export const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';
```

**Step 3: Run Test**
`npm test packages/ui/src/components/Table/Table.test.tsx`

**Step 4: Commit**

```bash
git add packages/ui/src/components/Table/Table.tsx packages/ui/src/components/Table/Table.test.tsx
git commit -m "feat(ui): add TableHeader, TableBody, TableFooter, TableCaption"
```

---

### Task 4: Implement TableRow, TableHead, TableCell

These components consume `TableContext` to apply correct padding and visual states.

**Files:**

- Modify: `packages/ui/src/components/Table/Table.tsx`
- Modify: `packages/ui/src/components/Table/Table.test.tsx`

**Step 1: Implement Row and Cells**
Append to `packages/ui/src/components/Table/Table.tsx`:

```typescript
import { useTableContext } from './TableContext';

// Helper for padding
const densityClasses = {
  s: 'p-2',
  m: 'p-4',
  l: 'p-6',
};

// TableRow
export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    const { hoverable, striped } = useTableContext();
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b transition-colors data-[state=selected]:bg-muted',
          hoverable && 'hover:bg-muted/50',
          striped && 'even:bg-muted/20', // Minimal stripe effect
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = 'TableRow';

// TableHead
export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const { density } = useTableContext();
    return (
      <th
        ref={ref}
        className={cn(
          'h-12 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          densityClasses[density],
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

// TableCell
export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const { density } = useTableContext();
    return (
      <td
        ref={ref}
        className={cn(
          'align-middle [&:has([role=checkbox])]:pr-0',
          densityClasses[density],
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';
```

**Step 2: Verify styles in Test**
Update `packages/ui/src/components/Table/Table.test.tsx` to check for density classes on cells.

**Step 3: Run Test**
`npm test packages/ui/src/components/Table/Table.test.tsx`

**Step 4: Commit**

```bash
git add packages/ui/src/components/Table/Table.tsx packages/ui/src/components/Table/Table.test.tsx
git commit -m "feat(ui): add TableRow, TableHead, TableCell with Context integration"
```

---

### Task 5: Implement Cell (Layout Helper)

The polymorphic layout primitive.

**Files:**

- Create: `packages/ui/src/components/Table/Cell.tsx`
- Create: `packages/ui/src/components/Table/Cell.test.tsx`

**Step 1: Write Test**
Create `packages/ui/src/components/Table/Cell.test.tsx`.

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell', () => {
  it('renders correctly with default props', () => {
    render(<Cell>Content</Cell>);
    expect(screen.getByText('Content')).toHaveClass('flex', 'items-center', 'text-left');
  });

  it('applies numeric variant styles', () => {
    render(<Cell variant="numeric">100</Cell>);
    expect(screen.getByText('100')).toHaveClass('justify-end');
  });
});
```

**Step 2: Implement Cell**
Create `packages/ui/src/components/Table/Cell.tsx`.

```typescript
import React, { forwardRef } from 'react';
import { cn } from '@ermnvldmr/stl';

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'numeric' | 'icon' | 'checkbox';
  layout?: 'flex' | 'stack';
  align?: 'start' | 'center' | 'end' | 'between';
  gap?: 's' | 'm' | 'l';
  truncate?: boolean;
  color?: 'default' | 'muted' | 'error' | 'success';
}

const gapClasses = {
  s: 'gap-1.5',
  m: 'gap-3',
  l: 'gap-4',
};

const colorClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  error: 'text-error',
  success: 'text-success',
};

export const Cell = forwardRef<HTMLDivElement, CellProps>(
  ({
    className,
    children,
    variant = 'text',
    layout = 'flex',
    align,
    gap,
    truncate = false,
    color = 'default',
    ...props
  }, ref) => {

    // Determine default alignment based on variant if not explicitly provided
    let defaultAlign = 'start';
    if (variant === 'numeric') defaultAlign = 'end';
    if (variant === 'icon' || variant === 'checkbox') defaultAlign = 'center';

    const finalAlign = align || defaultAlign;

    const alignClasses = {
      start: layout === 'flex' ? 'justify-start' : 'items-start',
      center: layout === 'flex' ? 'justify-center' : 'items-center',
      end: layout === 'flex' ? 'justify-end' : 'items-end',
      between: layout === 'flex' ? 'justify-between' : 'items-stretch', // Approximation for stack
    };

    return (
      <div
        ref={ref}
        className={cn(
          layout === 'flex' ? 'flex flex-row' : 'flex flex-col',
          layout === 'flex' && 'items-center', // Vertically center flex items by default
          alignClasses[finalAlign],
          gap && gapClasses[gap],
          color && colorClasses[color],
          truncate && 'truncate',
          variant === 'numeric' && 'tabular-nums',
          variant === 'checkbox' && 'w-min mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Cell.displayName = 'Cell';
```

**Step 3: Run Test**
`npm test packages/ui/src/components/Table/Cell.test.tsx`

**Step 4: Commit**

```bash
git add packages/ui/src/components/Table/Cell.tsx packages/ui/src/components/Table/Cell.test.tsx
git commit -m "feat(ui): add Cell layout primitive"
```

---

### Task 6: Export and Integration

Finalize package exports.

**Files:**

- Modify: `packages/ui/src/components/Table/index.ts`
- Modify: `packages/ui/src/components/index.ts`

**Step 1: Create Table/index.ts**

```typescript
export * from './Table';
export * from './Cell';
export * from './types';
```

**Step 2: Update Main Index**
Add `export * from './Table';` to `packages/ui/src/components/index.ts`.

**Step 3: Commit**

```bash
git add packages/ui/src/components/Table/index.ts packages/ui/src/components/index.ts
git commit -m "feat(ui): export Table components"
```
