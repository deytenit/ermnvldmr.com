/**
 * Type allowing arbitrary `data-*` attributes on component props.
 *
 * @example
 * ```typescript
 * interface ButtonProps extends DataAttributes {
 *   children: React.ReactNode;
 * }
 * ```
 */
export type DataAttributes = Record<`data-${string}`, string | number | boolean | undefined>;
