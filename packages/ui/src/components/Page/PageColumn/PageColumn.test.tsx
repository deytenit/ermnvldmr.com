import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PageColumn } from './PageColumn';

describe('PageColumn', () => {
  it('renders children correctly', () => {
    render(
      <PageColumn>
        <div data-testid="child">Test Content</div>
      </PageColumn>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container: small } = render(<PageColumn size="small">Content</PageColumn>);
    expect(small.firstChild).toHaveClass('lg:w-[var(--rb-page-column-small,300px)]');

    const { container: full } = render(<PageColumn size="full">Content</PageColumn>);
    expect(full.firstChild).toHaveClass('flex-1');
  });

  it('handles sticky prop', () => {
    const { container } = render(<PageColumn sticky>Content</PageColumn>);
    expect(container.firstChild).toHaveClass('lg:sticky');
    expect(container.firstChild).toHaveClass('lg:top-24');
  });

  it('renders as different element', () => {
    render(<PageColumn as="aside">Content</PageColumn>);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
});
