import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Supported list visual variants.
 */
export type ListVariant = 'unordered' | 'ordered' | 'plain';

/**
 * Supported spacing values between list items.
 */
export type ListSpacing = 'none' | 's' | 'm' | 'l';

/**
 * Props for the List component.
 */
export interface ListProps extends ClassNameProps, TestIdProps, React.HTMLAttributes<HTMLElement> {
  /** List content, typically List.Item or Li components */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: ListVariant;
  /** Spacing between items */
  spacing?: ListSpacing;
  /** Global marker override for all items in this list */
  marker?: React.ReactNode;
  /** Custom HTML element to render (defaults to ul/ol based on variant) */
  as?: React.ElementType;
}

const spacingStyles: Record<ListSpacing, string> = {
  none: 'gap-0',
  s: 'gap-1',
  m: 'gap-2',
  l: 'gap-4',
};

const variantStyles: Record<ListVariant, string> = {
  unordered: 'list-disc pl-5',
  ordered: 'list-decimal pl-5',
  plain: 'list-none pl-0',
};

const ListContext = React.createContext<{ marker?: React.ReactNode }>({});

const ListComponent = forwardRef<HTMLElement, ListProps>(function List(
  {
    children,
    variant = 'unordered',
    spacing = 'none',
    marker,
    as,
    className,
    'data-testid': testId,
    ...props
  },
  ref
) {
  const Component = as ?? (variant === 'ordered' ? 'ol' : 'ul');
  const hasCustomMarker = !!marker;

  return (
    <ListContext.Provider value={{ marker }}>
      <Component
        {...props}
        ref={castRef<HTMLElement>(ref)}
        className={cn(
          'm-0 flex flex-col',
          // Hide default markers if a global custom marker is provided
          hasCustomMarker ? 'list-none pl-0' : variantStyles[variant],
          spacingStyles[spacing],
          className
        )}
        data-testid={testId}
      >
        {children}
      </Component>
    </ListContext.Provider>
  );
});

/**
 * Props for a List item.
 */
export interface ListItemProps
  extends ClassNameProps,
    TestIdProps,
    React.HTMLAttributes<HTMLElement> {
  /** Item content */
  children: React.ReactNode;
  /** Specific marker override for this individual item */
  marker?: React.ReactNode;
}

const ListItemComponent = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { children, marker: itemMarker, className, 'data-testid': testId, ...props },
  ref
) {
  const { marker: listMarker } = React.useContext(ListContext);
  const effectiveMarker = itemMarker ?? listMarker;

  if (effectiveMarker) {
    return (
      <li
        {...props}
        ref={castRef<HTMLLIElement>(ref)}
        className={cn('flex gap-3 items-start', className)}
        data-testid={testId}
      >
        <span className="flex-shrink-0 flex items-center justify-center min-w-[1.25rem] min-h-[1.5rem]">
          {effectiveMarker}
        </span>
        <div className="flex-1">{children}</div>
      </li>
    );
  }

  return (
    <li
      {...props}
      ref={castRef<HTMLLIElement>(ref)}
      className={cn('relative', className)}
      data-testid={testId}
    >
      {children}
    </li>
  );
});

export const List = Object.assign(genericMemo(ListComponent), {
  Item: genericMemo(ListItemComponent),
});
