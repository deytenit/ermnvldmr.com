import { describe, expect, it } from 'vitest';

import { filterDataAttributes } from './filterDataAttributes';

describe('filterDataAttributes', () => {
  it('extracts all data-* attributes correctly', () => {
    const props = {
      id: 'button-1',
      className: 'btn',
      'data-testid': 'my-test-id',
      'data-umami-event': 'click-me',
      'data-umami-event-target': 'hero',
      onClick: () => {},
    };

    const result = filterDataAttributes(props);
    expect(result).toEqual({
      'data-testid': 'my-test-id',
      'data-umami-event': 'click-me',
      'data-umami-event-target': 'hero',
    });
  });

  it('returns an empty object when no data-* attributes are present', () => {
    const props = {
      id: 'header-1',
      className: 'header',
    };

    const result = filterDataAttributes(props);
    expect(result).toEqual({});
  });
});
