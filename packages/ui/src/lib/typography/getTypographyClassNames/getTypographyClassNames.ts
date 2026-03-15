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

const fontFamilyClasses: Record<TextType, string> = {
  display: 'font-serif',
  headline: 'font-serif',
  title: 'font-sans',
  body: 'font-sans',
  label: 'font-sans',
};

const colorClasses: Record<TextColor, string> = {
  default: 'text-[var(--rb-text)]',
  primary: 'text-[var(--rb-primary-text)]',
  secondary: 'text-[var(--rb-secondary-text)]',
  tertiary: 'text-[var(--rb-tertiary-text)]',
  error: 'text-[var(--rb-error-text)]',
  muted: 'text-[var(--rb-muted-text)]',
  inherit: 'text-inherit',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const wrapClasses: Record<TextWrap, string> = {
  nowrap: 'whitespace-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
};

/**
 * Returns a space-separated string of Tailwind CSS classes for the given
 * typography options.
 *
 * The returned string is safe to pass directly to `cn()` alongside other
 * classes — it contains no internal conflicts. Tailwind-merge is configured
 * (via the stl `cn` utility) to treat `text-rb-{type}-{size}` as a
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
    type = 'body',
    size = 'm',
    color = 'default',
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
    truncationClass = `line-clamp-${maxLines}`;
  } else if (overflow === 'ellipsis') {
    truncationClass = 'truncate';
  } else if (overflow === 'clip') {
    truncationClass = 'overflow-clip';
  }

  return [
    `text-rb-${type}-${size}`,
    fontFamilyClasses[type],
    type === 'label' && 'font-medium',
    colorClasses[color],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    strike && 'line-through',
    align && alignClasses[align],
    wrap && wrapClasses[wrap],
    truncationClass,
  ]
    .filter(Boolean)
    .join(' ');
}
