import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { PageColumn, PageColumns, PageContainer, PageRoot } from './index';

describe('Page Components Integration', () => {
  it('renders PageRoot, PageContainer, PageColumns, and PageColumn together', () => {
    render(
      <PageRoot className="test-root">
        <PageContainer className="test-container" width="default">
          <PageColumns className="test-columns">
            <PageColumn className="test-column" size="full">
              Page Content
            </PageColumn>
          </PageColumns>
        </PageContainer>
      </PageRoot>
    );

    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
