# Table Component Design

**Date:** 2026-02-08
**Status:** Approved
**Topic:** Core Table Primitives for Rainby Design System

## 1. Overview

A comprehensive, accessible, and highly composable set of Table components. The goal is to provide a direct counterpart to every native HTML table element, styled according to the Rainby Design System, while offering a specialized `Cell` helper to manage common content layouts (alignment, icons, truncation) without enforcing complex logic.

## 2. Architecture

The solution uses a **Context-based** architecture. The root `Table` component accepts high-level style props (`density`, `variant`) and propagates them to all child components via React Context. This avoids prop-drilling and ensures visual consistency.

### Components

- **`TableContainer`**: Wrapper for responsive scrolling and outer boundary styling.
- **`Table`**: Root element. Manages context.
- **`TableHeader`** (`thead`), **`TableBody`** (`tbody`), **`TableFooter`** (`tfoot`): Semantic wrappers.
- **`TableRow`** (`tr`): Handles row-level states (hover, striping).
- **`TableHead`** (`th`): Header cells.
- **`TableCell`** (`td`): Data cells.
- **`TableCaption`** (`caption`): Accessible description.
- **`Cell`**: **(New)** A polymorphic layout primitive for content _inside_ cells.

## 3. API & Props

### 3.1 `Table` (Root)

| Prop           | Type                                | Default     | Description                                   |
| :------------- | :---------------------------------- | :---------- | :-------------------------------------------- |
| `density`      | `'s' \| 'm' \| 'l'`                 | `'m'`       | Controls padding of all cells.                |
| `variant`      | `'surface' \| 'outline' \| 'ghost'` | `'surface'` | Controls borders and backgrounds.             |
| `striped`      | `boolean`                           | `false`     | Enables zebra-striping on rows.               |
| `hoverable`    | `boolean`                           | `false`     | Enables hover effects on rows.                |
| `stickyHeader` | `boolean`                           | `false`     | Fixes the header to the top of the container. |

### 3.2 `Cell` (Content Helper)

Used strictly for _layout and styling_ within a `TableCell` or `TableHead`. It does **not** handle sorting logic.

| Prop       | Type                                           | Default     | Description                        |
| :--------- | :--------------------------------------------- | :---------- | :--------------------------------- |
| `variant`  | `'text' \| 'numeric' \| 'icon' \| 'checkbox'`  | `'text'`    | Presets for alignment and spacing. |
| `layout`   | `'flex' \| 'stack'`                            | `'flex'`    | Internal flex direction.           |
| `align`    | `'start' \| 'center' \| 'end' \| 'between'`    | _(auto)_    | Flex alignment overrides.          |
| `truncate` | `boolean`                                      | `false`     | Forces single-line ellipsis.       |
| `color`    | `'default' \| 'muted' \| 'error' \| 'success'` | `'default'` | Text color token mapping.          |

## 4. Styling Strategy

### Visual Tokens

Mappings to Rainby CSS variables:

- **Backgrounds**: `bg-surface` (default), `bg-muted/50` (headers/striped).
- **Borders**: `border-border` (outline), `border-b` only (ghost).
- **Text**: `text-foreground` (body), `text-muted-foreground` (headers/icons).

### Density Map

- **Small (`s`)**: `px-3 py-2 text-sm`
- **Medium (`m`)**: `px-4 py-3 text-sm`
- **Large (`l`)**: `px-6 py-4 text-base`

## 5. Usage Example

```tsx
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Cell,
} from '@ermnvldmr/ui';

export const UserList = () => (
  <TableContainer>
    <Table density="m" variant="surface" striped hoverable>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Cell variant="checkbox">
              <Checkbox />
            </Cell>
          </TableHead>
          <TableHead>
            <Cell>User</Cell>
          </TableHead>
          <TableHead>
            <Cell variant="numeric">Revenue</Cell>
          </TableHead>
          <TableHead>
            <Cell variant="icon">Actions</Cell>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>
            <Cell variant="checkbox">
              <Checkbox />
            </Cell>
          </TableCell>
          <TableCell>
            {/* Complex Content Layout */}
            <Cell layout="flex" gap="m">
              <Avatar src="..." />
              <Cell layout="stack" gap="s">
                <span className="font-medium">Jane Doe</span>
                <span className="text-muted-foreground text-xs">Admin</span>
              </Cell>
            </Cell>
          </TableCell>
          <TableCell>
            <Cell variant="numeric">$1,200.00</Cell>
          </TableCell>
          <TableCell>
            <Cell variant="icon">
              <Button variant="ghost" size="s" icon="more-horizontal" />
            </Cell>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
```

## 6. Implementation Notes

- **Accessibility**: Ensure `th` elements have `scope="col"` or `scope="row"` automatically where possible, or allow override. `TableCaption` is critical for screen readers.
- **Polymorphism**: `TableContainer` should probably just be a `div`, but `Table` components must forward refs to underlying DOM nodes.
- **Sorting**: Sorting UI is manual. Users will wrap `Cell` content in a button or place a sort icon next to it manually.
