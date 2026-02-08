# Rainby Table Components Implementation Plan (Refined)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a comprehensive, modular, and highly controllable Table system adhering to Rainby design standards. This involves a compound component architecture with granular file separation, memoization, and exhaustive testing.

**Architecture:**

- **Compound Pattern:** `Table` as the main entry point with sub-components attached (e.g., `Table.Row`).
- **Context API:** `TableContext` for global defaults (`density`, `variant`, `striped`).
- **Granular Control:** Overrides at row and cell levels (e.g., `padding`, `noBorder`).
- **Standards:** `forwardRef` with named functions, `genericMemo` wrapping, and separate files for every sub-component.

**Tech Stack:** React 19, Tailwind CSS, TypeScript, `@ermnvldmr/stl` (for `cn`, `castRef`, `genericMemo`).

---

### Task 1: Foundation (Types & Context)

Setup the shared types and the React Context that will drive the table's global styling.

**Files:**

- Create: `packages/ui/src/components/Table/types.ts`
- Create: `packages/ui/src/components/Table/TableContext.tsx`

**Step 1: Define Shared Types**
Create `packages/ui/src/components/Table/types.ts`.

```typescript
export type TableDensity = 's' | 'm' | 'l';
export type TableVariant = 'surface' | 'outline' | 'ghost';
export type TablePadding = 'none' | TableDensity;

export interface TableContextValue {
  density: TableDensity;
  variant: TableVariant;
  striped: boolean;
  hoverable: boolean;
}
```

**Step 2: Create Context & Hook**
Create `packages/ui/src/components/Table/TableContext.tsx`.

```typescript
import { createContext, useContext } from 'react';
import type { TableContextValue } from './types';

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within a Table component.');
  }
  return context;
}

export const TableProvider = TableContext.Provider;
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/Table/types.ts packages/ui/src/components/Table/TableContext.tsx
git commit -m "feat(ui): add Table types and context"
```

---

### Task 2: Implement TableRow (Granular Control)

Implement the row component with specific overrides for borders and hover states.

**Files:**

- Create: `packages/ui/src/components/Table/TableRow/TableRow.tsx`
- Create: `packages/ui/src/components/Table/TableRow/TableRow.test.tsx`

**Step 1: Implement TableRow**
Create `packages/ui/src/components/Table/TableRow/TableRow.tsx`.

```typescript
import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';
import { useTableContext } from '../TableContext';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  noBorder?: boolean;
  hoverable?: boolean;
  selected?: boolean;
}

const TableRowComponent = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, children, noBorder, hoverable, selected, ...props }, ref) {
    const context = useTableContext();
    const isHoverable = hoverable ?? context.hoverable;

    return (
      <tr
        {...props}
        ref={castRef<HTMLTableRowElement>(ref)}
        className={cn(
          'border-b transition-colors',
          !noBorder && 'border-border',
          noBorder && 'border-b-0',
          isHoverable && 'hover:bg-muted/50',
          context.striped && 'even:bg-muted/20',
          selected && 'bg-muted',
          className
        )}
      >
        {children}
      </tr>
    );
  }
);

export const TableRow = genericMemo(TableRowComponent);
```

**Step 2: Write TableRow Test**
Create `packages/ui/src/components/Table/TableRow/TableRow.test.tsx`.

**Step 3: Commit**

```bash
git add packages/ui/src/components/Table/TableRow/
git commit -m "feat(ui): implement TableRow with granular controls"
```

---

### Task 3: Implement TableCell & TableHead (Padding Overrides)

Implement the data and header cells with support for padding overrides.

**Files:**

- Create: `packages/ui/src/components/Table/TableCell/TableCell.tsx`
- Create: `packages/ui/src/components/Table/TableHead/TableHead.tsx`

**Step 1: Implement TableCell**
Create `packages/ui/src/components/Table/TableCell/TableCell.tsx`.

```typescript
import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';
import { useTableContext } from '../TableContext';
import type { TablePadding } from '../types';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  padding?: TablePadding;
  align?: 'left' | 'center' | 'right';
}

const paddingClasses: Record<TablePadding, string> = {
  none: 'p-0',
  s: 'p-2',
  m: 'p-4',
  l: 'p-6',
};

const TableCellComponent = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, children, padding, align, ...props }, ref) {
    const { density } = useTableContext();
    const finalPadding = padding || density;

    return (
      <td
        {...props}
        ref={castRef<HTMLTableCellElement>(ref)}
        className={cn(
          'align-middle',
          paddingClasses[finalPadding],
          align === 'left' && 'text-left',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          className
        )}
      >
        {children}
      </td>
    );
  }
);

export const TableCell = genericMemo(TableCellComponent);
```

**Step 2: Implement TableHead** (Similar logic to TableCell but for `th`)

**Step 3: Commit**

```bash
git add packages/ui/src/components/Table/TableCell/ packages/ui/src/components/Table/TableHead/
git commit -m "feat(ui): implement TableCell and TableHead with padding overrides"
```

---

### Task 4: Implement Cell (Layout Primitive)

Implement the internal layout helper for cell content.

**Files:**

- Create: `packages/ui/src/components/Table/Cell/Cell.tsx`

**Step 1: Implement Cell**
Create `packages/ui/src/components/Table/Cell/Cell.tsx`.
Follow the Section 3 design (polymorphic variants for numeric, icon, etc.).

**Step 2: Commit**

```bash
git add packages/ui/src/components/Table/Cell/
git commit -m "feat(ui): implement Cell layout primitive"
```

---

### Task 5: Root Component & Assembly

Finalize the root `Table` component and assemble the compound API.

**Files:**

- Create: `packages/ui/src/components/Table/Table.tsx`
- Create: `packages/ui/src/components/Table/TableContainer.tsx`
- Modify: `packages/ui/src/components/Table/index.ts`

**Step 1: Assemble Table**
In `packages/ui/src/components/Table/Table.tsx`, use `Object.assign` to attach all sub-components.

**Step 2: Final Commit & Exports**

```bash
git add packages/ui/src/components/Table/
git commit -m "feat(ui): finalize Table compound component assembly"
```
