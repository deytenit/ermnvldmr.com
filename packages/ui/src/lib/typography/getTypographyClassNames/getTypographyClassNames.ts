import { cva } from 'class-variance-authority';

/**
 * Typography type roles.
 * Determines font family and base visual treatment.
 */
export type TextType = 'display' | 'headline' | 'title' | 'body' | 'label';

/**
 * Typography size scale.
 * Applied within a type role to select the appropriate @theme token.
 */
export type TextSize = 's' | 'm' | 'l';

/**
 * Text color variants mapped to design-system CSS custom properties.
 */
export type TextColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'muted'
  | 'inherit';

/**
 * Text alignment.
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Text wrapping behaviour.
 */
export type TextWrap = 'nowrap' | 'balance' | 'pretty';

/**
 * Overflow handling for single-line text.
 */
export type TextOverflow = 'ellipsis' | 'clip';

/**
 * Full set of typography options supported by getTypographyClassNames.
 */
export interface TypographyOptions {
  /** Typography role — determines font family and base style. */
  type?: TextType;
  /** Size scale within the role. */
  size?: TextSize;
  /** Text color variant. */
  color?: TextColor;
  /** Bold weight. */
  bold?: boolean;
  /** Italic style. */
  italic?: boolean;
  /** Underline decoration. */
  underline?: boolean;
  /** Strikethrough decoration. */
  strike?: boolean;
  /** Text alignment. */
  align?: TextAlign;
  /** Text wrapping behaviour. */
  wrap?: TextWrap;
  /** Overflow truncation for single lines. */
  overflow?: TextOverflow;
  /** Maximum visible lines (truncates with ellipsis). Takes precedence over overflow. */
  maxLines?: number;
}

const typographyVariants = cva('', {
  variants: {
    type: {
      display: 'font-serif',
      headline: 'font-serif',
      title: 'font-sans',
      body: 'font-sans',
      label: 'font-sans font-medium',
    },
    size: {
      s: '',
      m: '',
      l: '',
    },
    color: {
      default: 'text-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
      tertiary: 'text-tertiary-text',
      error: 'text-error-text',
      muted: 'text-muted-text',
      inherit: 'text-inherit',
    },
    bold: {
      true: 'font-bold',
      false: '',
    },
    italic: {
      true: 'italic',
      false: '',
    },
    underline: {
      true: 'underline',
      false: '',
    },
    strike: {
      true: 'line-through',
      false: '',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    wrap: {
      nowrap: 'whitespace-nowrap',
      balance: 'text-balance',
      pretty: 'text-pretty',
    },
    overflow: {
      ellipsis: 'truncate',
      clip: 'overflow-clip',
    },
  },
  compoundVariants: [
    { type: 'display', size: 's', className: 'text-display-s' },
    { type: 'display', size: 'm', className: 'text-display-m' },
    { type: 'display', size: 'l', className: 'text-display-l' },
    { type: 'headline', size: 's', className: 'text-headline-s' },
    { type: 'headline', size: 'm', className: 'text-headline-m' },
    { type: 'headline', size: 'l', className: 'text-headline-l' },
    { type: 'title', size: 's', className: 'text-title-s' },
    { type: 'title', size: 'm', className: 'text-title-m' },
    { type: 'title', size: 'l', className: 'text-title-l' },
    { type: 'body', size: 's', className: 'text-body-s' },
    { type: 'body', size: 'm', className: 'text-body-m' },
    { type: 'body', size: 'l', className: 'text-body-l' },
    { type: 'label', size: 's', className: 'text-label-s' },
    { type: 'label', size: 'm', className: 'text-label-m' },
    { type: 'label', size: 'l', className: 'text-label-l' },
  ],
  defaultVariants: {},
});

const lineClampMap: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/**
 * Returns a space-separated string of Tailwind CSS classes for the given
 * typography options.
 *
 * The returned string is safe to pass directly to `cn()` alongside other
 * classes — it contains no internal conflicts. Tailwind-merge is configured
 * (via the stl `cn` utility) to treat `text-{type}-{size}` as a
 * font-size group so it never conflicts with text-color classes.
 *
 * @example
 * ```tsx
 * // In a component:
 * <p className={cn(getTypographyClassNames({ type: 'body', size: 'l' }), className)}>
 *
 * // In a CSS-cascade parent/child pattern:
 * <div className="rb-scale-l">
 *   <p className={cn(getTypographyClassNames({ type: 'body' }))}>…</p>
 * </div>
 * ```
 */
export function getTypographyClassNames(options: TypographyOptions = {}): string {
  const {
    type,
    size,
    color,
    bold = false,
    italic = false,
    underline = false,
    strike = false,
    align,
    wrap,
    overflow,
    maxLines,
  } = options;

  let truncationClass = '';
  if (maxLines) {
    truncationClass = lineClampMap[maxLines] ?? `line-clamp-[${maxLines}]`;
  }

  const classNames = typographyVariants({
    type,
    size,
    color,
    bold,
    italic,
    underline,
    strike,
    align,
    wrap,
    overflow: maxLines ? undefined : overflow,
  });

  return [classNames, truncationClass].filter(Boolean).join(' ');
}
