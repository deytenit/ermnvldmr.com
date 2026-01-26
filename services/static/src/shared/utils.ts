/**
 * Returns the current year
 *
 * @returns {number} The current year
 * @example
 * getCurrentYear() // 2024
 */
export const getCurrentYear = (): number => new Date().getFullYear();

/**
 * Returns MDN URL for a given HTTP status code
 *
 * @param {number | string} code - The HTTP status code
 * @returns {string} The MDN URL for the status code
 * @example
 * getHttpStatusUrl(404) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export const getHttpStatusUrl = (code: number | string): string =>
  `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`;
