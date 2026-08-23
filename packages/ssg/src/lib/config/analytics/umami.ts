import type { AnalyticsHtmlTag, AnalyticsProvider } from './types.js';

/**
 * Configuration options for the Umami Analytics provider.
 */
export interface UmamiAnalyticsOptions {
  /** Base URL of the Umami server (e.g., 'https://umami.ermnvldmr.com'). */
  serverUrl: string;
  /** Unique website ID UUID assigned by Umami. */
  websiteId: string;
  /** Comma-separated list of allowed domains (e.g., 'ermnvldmr.com,www.ermnvldmr.com'). */
  domains?: string;
  /** Custom tracker script name. Defaults to 'script.js'. */
  scriptName?: string;
  /** Whether to respect the browser's Do Not Track setting. Defaults to true. */
  doNotTrack?: boolean;
  /** Optional data tag for event categorization. */
  tag?: string;
  /** Optional custom host URL for event endpoint. */
  hostUrl?: string;
  /** Whether to auto-track page views. Defaults to true. */
  autoTrack?: boolean;
  /** Whether to force tag injection in non-production builds. Defaults to false. */
  force?: boolean;
}

/**
 * Creates an Umami Analytics provider for SSG service configurations.
 *
 * Automatically produces `<script>` tags in production builds and suppresses
 * injection in development to keep analytics clean.
 *
 * @param options - Umami configuration options.
 * @returns An AnalyticsProvider instance for Umami.
 *
 * @example
 * ```typescript
 * import { defineSSGServiceConfig, umamiAnalytics } from '@ermnvldmr/ssg/dev';
 *
 * export default defineSSGServiceConfig({
 *   analytics: [
 *     umamiAnalytics({
 *       serverUrl: 'https://umami.ermnvldmr.com',
 *       websiteId: '4fca5ac2-4fe4-4626-b708-933c37bfe918',
 *       domains: 'ermnvldmr.com,www.ermnvldmr.com',
 *       doNotTrack: true,
 *     }),
 *   ],
 * });
 * ```
 */
export function umamiAnalytics(options: UmamiAnalyticsOptions): AnalyticsProvider {
  return {
    name: 'umami',
    getHtmlTags: (isProduction: boolean): AnalyticsHtmlTag[] => {
      if (!isProduction && !options.force) {
        return [];
      }

      const serverUrl = options.serverUrl.replace(/\/+$/, '');
      const scriptName = options.scriptName ?? 'script.js';
      const scriptSrc = `${serverUrl}/${scriptName}`;

      const attrs: Record<string, string | boolean | undefined> = {
        defer: true,
        src: scriptSrc,
        'data-website-id': options.websiteId,
      };

      if (options.domains) {
        attrs['data-domains'] = options.domains;
      }

      if (options.doNotTrack !== false) {
        attrs['data-do-not-track'] = 'true';
      }

      if (options.tag) {
        attrs['data-tag'] = options.tag;
      }

      if (options.hostUrl) {
        attrs['data-host-url'] = options.hostUrl;
      }

      if (options.autoTrack === false) {
        attrs['data-auto-track'] = 'false';
      }

      return [
        {
          tag: 'script',
          attrs,
          head: true,
        },
      ];
    },
  };
}
