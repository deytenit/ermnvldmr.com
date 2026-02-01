/**
 * Props interface for components that accept a className prop.
 *
 * @example
 * ```typescript
 * interface ButtonProps extends ClassNameProps {
 *   children: string;
 * }
 * ```
 */
export interface ClassNameProps {
  /** Optional CSS class name */
  className?: string;
}
