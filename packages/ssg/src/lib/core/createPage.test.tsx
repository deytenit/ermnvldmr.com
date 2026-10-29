import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { createPage, getPageOptions } from './createPage';

describe('createPage and getPageOptions', () => {
  beforeEach(() => {
    document.title = 'Default Title';
    const existingMeta = document.querySelector('meta[name="description"]');
    if (existingMeta) {
      existingMeta.remove();
    }
  });

  it('attaches metadata options to component and retrieves them via getPageOptions', () => {
    function SamplePage(): React.JSX.Element {
      return <div>Sample</div>;
    }

    createPage(SamplePage, {
      title: 'Sample Title',
      description: 'Sample Description',
    });

    const options = getPageOptions(SamplePage);
    expect(options).toEqual({
      title: 'Sample Title',
      description: 'Sample Description',
    });
  });

  it('returns undefined for entities without metadata options', () => {
    function PlainComponent(): React.JSX.Element {
      return <div>Plain</div>;
    }

    expect(getPageOptions(PlainComponent)).toBeUndefined();
    expect(getPageOptions(null)).toBeUndefined();
    expect(getPageOptions(undefined)).toBeUndefined();
    expect(getPageOptions('string')).toBeUndefined();
    expect(getPageOptions(123)).toBeUndefined();
    expect(getPageOptions({})).toBeUndefined();
  });

  it('updates document.title and creates meta description in DOM', () => {
    function MetaPage(): React.JSX.Element {
      return <div>Meta</div>;
    }

    createPage(MetaPage, {
      title: 'Custom Title',
      description: 'Custom Description',
    });

    expect(document.title).toBe('Custom Title');
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe('Custom Description');
  });

  it('updates existing meta description if already present in DOM', () => {
    const existingMeta = document.createElement('meta');
    existingMeta.setAttribute('name', 'description');
    existingMeta.setAttribute('content', 'Old Description');
    document.head.appendChild(existingMeta);

    function AnotherMetaPage(): React.JSX.Element {
      return <div>Another Meta</div>;
    }

    createPage(AnotherMetaPage, {
      description: 'Updated Description',
    });

    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('Updated Description');
  });
});
