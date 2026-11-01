import { describe, expect, it } from 'vitest';

import { umamiAnalytics } from './umami';

describe('umamiAnalytics', () => {
  it('suppresses script injection in non-production environments when not forced', () => {
    const provider = umamiAnalytics({
      serverUrl: '/pulse',
      websiteId: 'test-website-id',
    });

    expect(provider.getHtmlTags(false)).toEqual([]);
  });

  it('injects script tag in non-production when force is true', () => {
    const provider = umamiAnalytics({
      serverUrl: '/pulse',
      websiteId: 'test-website-id',
      force: true,
    });

    const tags = provider.getHtmlTags(false);
    expect(tags).toHaveLength(1);
    expect(tags[0]?.attrs?.src).toBe('/pulse/script.js');
  });

  it('generates expected script attributes in production builds', () => {
    const provider = umamiAnalytics({
      serverUrl: '/trace/',
      scriptName: 'trace.js',
      hostUrl: '/trace',
      websiteId: '41c7699a-0675-4f49-bcd0-3df47a66b6b1',
      domains: 'ermnvldmr.com,www.ermnvldmr.com',
      doNotTrack: true,
      tag: 'landing',
    });

    const tags = provider.getHtmlTags(true);
    expect(tags).toEqual([
      {
        tag: 'script',
        head: true,
        publicPath: false,
        attrs: {
          defer: true,
          src: '/trace/trace.js',
          'data-website-id': '41c7699a-0675-4f49-bcd0-3df47a66b6b1',
          'data-host-url': '/trace',
          'data-domains': 'ermnvldmr.com,www.ermnvldmr.com',
          'data-do-not-track': 'true',
          'data-tag': 'landing',
        },
      },
    ]);
  });
});
