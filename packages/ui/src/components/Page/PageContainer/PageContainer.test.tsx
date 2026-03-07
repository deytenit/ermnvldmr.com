import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div data-testid="child">Test Content</div>
      </PageContainer>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct width classes', () => {
    const { container: slim } = render(<PageContainer width="slim">Content</PageContainer>);
    expect(slim.firstChild).toHaveClass('max-w-[var(--rb-page-width-slim,1100px)]');

    const { container: def } = render(<PageContainer width="default">Content</PageContainer>);
    expect(def.firstChild).toHaveClass('max-w-[var(--rb-page-width-default,1600px)]');

    const { container: wide } = render(<PageContainer width="wide">Content</PageContainer>);
    expect(wide.firstChild).toHaveClass('max-w-[var(--rb-page-width-wide,1920px)]');

    const { container: full } = render(<PageContainer width="full">Content</PageContainer>);
    expect(full.firstChild).toHaveClass('max-w-full');
  });

  it('applies padding classes', () => {
    const { container: small } = render(
      <PageContainer paddingX="small" paddingY="small">
        Content
      </PageContainer>
    );
    expect(small.firstChild).toHaveClass('px-2');
    expect(small.firstChild).toHaveClass('py-4');

    const { container: large } = render(
      <PageContainer paddingX="large" paddingY="large">
        Content
      </PageContainer>
    );
    expect(large.firstChild).toHaveClass('px-6');
    expect(large.firstChild).toHaveClass('py-12');
  });

  it('handles centerVertically prop', () => {
    const { container } = render(<PageContainer centerVertically>Content</PageContainer>);
    expect(container.firstChild).toHaveClass('flex-1');
    expect(container.firstChild).toHaveClass('flex-col');
    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('renders as different element', () => {
    render(<PageContainer as="main">Content</PageContainer>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
