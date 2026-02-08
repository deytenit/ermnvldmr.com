import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * Props for the TableContent component.
 */
export interface TableContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant presets.
   * @default 'text'
   */
  variant?: 'text' | 'numeric' | 'icon' | 'checkbox';
  /**
   * Internal layout direction.
   * @default 'flex'
   */
  layout?: 'flex' | 'stack';
  /** Flex alignment override */
  align?: 'start' | 'center' | 'end' | 'between';
  /** Spacing between items */
  gap?: 's' | 'm' | 'l';
  /**
   * Whether to truncate text with ellipsis (single line).
   * @default false
   */
  truncate?: boolean;
  /**
   * Maximum number of lines to display before truncating with ellipsis.
   * Overrides 'truncate' if provided.
   */
  maxLines?: number;
  /**
   * Text color variant.
   * @default 'default'
   */
  color?: 'default' | 'muted' | 'error' | 'success';
}

const gapClasses: Record<string, string> = {
  s: 'gap-1.5',
  m: 'gap-3',
  l: 'gap-4',
};

const colorClasses: Record<string, string> = {
  default: 'text-[var(--rb-text)]',
  muted: 'text-[var(--rb-muted-text)]',
  error: 'text-[var(--rb-error-text)]',
  success: 'text-[var(--rb-success-text)]',
};

/**
 * A polymorphic layout primitive for content within table cells.
 * Standardizes alignment, spacing, and truncation for common data types.
 *
 * @param props - Component properties
 * @returns The rendered layout element
 *
 * @example
 * ```tsx
 * <Table.Content variant="numeric">$1,234.56</Table.Content>
 * ```
 *
 * @example
 * ```tsx
 * <Table.Content maxLines={2}>
 *   This is a long description that will be truncated after two lines.
 * </Table.Content>
 * ```
 */
export const TableContent = genericMemo(
  forwardRef<HTMLDivElement, TableContentProps>(function TableContent(
    {
      className,
      children,
      variant = 'text',
      layout = 'flex',
      align,
      gap,
      truncate = false,
      maxLines,
      color = 'default',
      style,
      ...props
    },
    ref
  ) {
    const alignClasses = {
      start: layout === 'flex' ? 'justify-start' : 'items-start',
      center: layout === 'flex' ? 'justify-center' : 'items-center',
      end: layout === 'flex' ? 'justify-end' : 'items-end',
      between: layout === 'flex' ? 'justify-between' : 'items-stretch',
    };

    // Determine default alignment based on variant if not explicitly provided
    let defaultAlign: keyof typeof alignClasses = 'start';
    if (variant === 'numeric') defaultAlign = 'end';
    else if (variant === 'icon' || variant === 'checkbox') defaultAlign = 'center';

    const finalAlign = align ?? defaultAlign;
    const alignmentClass = alignClasses[finalAlign];

    // Truncation logic
    const isTruncated = truncate || maxLines !== undefined;
    const lineCount = maxLines ?? (truncate ? 1 : undefined);

    return (
      <div
        {...props}
        ref={castRef<HTMLDivElement>(ref)}
        className={cn(
          'flex',
          layout === 'flex' ? 'flex-row items-center' : 'flex-col',
          alignmentClass,
          gap && gapClasses[gap],
          colorClasses[color],
          // When truncating, we need to handle block layout and min-width
          isTruncated && (lineCount === 1 ? 'truncate block' : 'line-clamp'),
          isTruncated && 'min-w-0',
          variant === 'numeric' && 'tabular-nums',
          variant === 'checkbox' && 'w-min mx-auto',
          className
        )}
        style={{
          ...(lineCount && lineCount > 1
            ? { WebkitLineClamp: lineCount, display: '-webkit-box', WebkitBoxOrient: 'vertical' }
            : {}),
          ...style,
        }}
      >
        {children}
      </div>
    );
  })
);
