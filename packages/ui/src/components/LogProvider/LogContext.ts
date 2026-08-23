import { createContext, useContext } from 'react';

/**
 * Function signature for telemetry and event logging.
 */
export type LogFn = (event: string, data?: Record<string, string | number | boolean>) => void;

const noopLogger: LogFn = () => undefined;

/**
 * React context holding the active logging function.
 */
export const LogContext = createContext<LogFn>(noopLogger);

/**
 * Hook to access the logging function from the nearest LogProvider.
 *
 * Defaults to a safe no-op if rendered outside a LogProvider.
 *
 * @returns The active logging function.
 *
 * @example
 * ```tsx
 * const log = useLogger();
 * log('button-click', { buttonId: 'submit' });
 * ```
 */
export function useLogger(): LogFn {
  return useContext(LogContext);
}
