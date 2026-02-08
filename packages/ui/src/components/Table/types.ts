/**
 * Table density options.
 * - 's': Small (compact)
 * - 'm': Medium (standard)
 * - 'l': Large (spacious)
 */
export type TableDensity = 's' | 'm' | 'l';

/**
 * Table visual variants.
 * - 'surface': Standard with background
 * - 'outline': Bordered without background
 * - 'ghost': No borders or background
 */
export type TableVariant = 'surface' | 'outline' | 'ghost';

/**
 * Table padding options.
 * Includes all density presets and 'none'.
 */
export type TablePadding = 'none' | TableDensity;

/**
 * Table cell border options.
 */
export type TableCellBorder = 'none' | 'all' | 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y';

/**
 * Global configuration for the Table system.
 */
export interface TableContextValue {
  /** The density of the table rows and cells */
  density: TableDensity;
  /** The visual style of the table */
  variant: TableVariant;
  /** Whether rows should have alternating background colors */
  striped: boolean;
  /** Whether rows should highlight on hover */
  hoverable: boolean;
  /** Whether to show borders between all cells (grid mode) */
  grid?: boolean;
}
