import React, { useMemo } from 'react';

import { LogContext } from './LogContext';

import type { LogFn } from './LogContext';

/**
 * Props for the LogProvider component.
 */
export interface LogProviderProps {
  /** The telemetry logging function to inject into the React tree. */
  logger?: LogFn;
  /** Children components that will have access to the logger via useLogger. */
  children: React.ReactNode;
}

/**
 * Provider component for injecting analytics and telemetry loggers into the UI component tree.
 *
 * @param props - Component props containing optional logger and children.
 * @returns React context provider element.
 *
 * @example
 * ```tsx
 * <LogProvider logger={trackEvent}>
 *   <App />
 * </LogProvider>
 * ```
 */
export function LogProvider({ logger, children }: LogProviderProps): React.JSX.Element {
  const value: LogFn = useMemo(() => logger ?? (() => undefined), [logger]);

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}
