/**
 * HTML script or link tag descriptor for analytics injection.
 */
export interface AnalyticsHtmlTag {
  /** The HTML tag name. */
  tag: string;
  /** Attributes to attach to the tag element. */
  attrs?: Record<string, string | boolean | undefined>;
  /** Optional inline text content of the tag. */
  children?: string;
  /** Whether the tag should be injected into the document <head>. */
  head?: boolean;
  /** Whether the tag should be appended at the end. */
  append?: boolean;
}

/**
 * Interface representing a configurable analytics provider for SSG services.
 */
export interface AnalyticsProvider {
  /** Provider identifier (e.g. 'umami', 'plausible'). */
  readonly name: string;
  /**
   * Generates the HTML tags required for this provider.
   *
   * @param isProduction - Whether the current build is in production mode.
   * @returns Array of HTML tag descriptors.
   */
  getHtmlTags: (isProduction: boolean) => AnalyticsHtmlTag[];
}

/**
 * Key-value mapping for analytics event metadata.
 */
export type AnalyticsEventData = Record<string, string | number | boolean>;
