import type { AnalyticsEventData } from '../config/analytics/types.js';

declare global {
  /**
   * Browser window global augmentation.
   */
  interface Window {
    /**
     * Umami Analytics tracker instance.
     */
    umami?: {
      /**
       * Tracks a custom event.
       *
       * @param eventName - Name of the custom event.
       * @param eventData - Optional key-value payload.
       */
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
      /**
       * Identifies the current session with custom session properties.
       *
       * @param sessionData - Key-value session data.
       */
      identify: (sessionData: Record<string, string | number | boolean>) => void;
    };
  }
}

/**
 * Safely tracks a custom event across active client-side analytics providers (e.g., Umami).
 *
 * If no analytics provider is loaded (e.g. during local dev, SSR, or ad-blocked), this is a safe no-op.
 *
 * @param eventName - Name of the event to track.
 * @param eventData - Optional key-value metadata object.
 *
 * @example
 * ```typescript
 * import { trackEvent } from '@ermnvldmr/ssg';
 *
 * trackEvent('switch-locale', { locale: 'ru' });
 * ```
 */
export function trackEvent(eventName: string, eventData?: AnalyticsEventData): void {
  if (typeof window !== 'undefined' && typeof window.umami?.track === 'function') {
    window.umami.track(eventName, eventData);
  }
}

/**
 * Safely identifies the session with custom attributes across active analytics providers.
 *
 * If no analytics provider is loaded (e.g. during local dev, SSR, or ad-blocked), this is a safe no-op.
 *
 * @param sessionData - Key-value session metadata.
 *
 * @example
 * ```typescript
 * import { identifySession } from '@ermnvldmr/ssg';
 *
 * identifySession({ theme: 'dark', locale: 'en' });
 * ```
 */
export function identifySession(sessionData: AnalyticsEventData): void {
  if (typeof window !== 'undefined' && typeof window.umami?.identify === 'function') {
    window.umami.identify(sessionData);
  }
}
