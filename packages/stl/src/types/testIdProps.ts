/**
 * Props interface for components that accept a test ID prop for React Testing Library.
 * 
 * @example
 * ```typescript
 * interface ButtonProps extends TestIdProps {
 *   children: string;
 * }
 * ```
 */
export interface TestIdProps {
  /** Test identifier for React Testing Library queries */
  'data-testid'?: string;
}
