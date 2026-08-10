import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PageColumns } from './PageColumns';

describe('PageColumns', () => {
  it('renders children correctly', () => {
    render(
      <PageColumns>
        <div data-testid="child">Test Content</div>
      </PageColumns>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies gap class', () => {
    const { container: gap8 } = render(<PageColumns gap={8}>Content</PageColumns>);
    expect(gap8.firstChild).toHaveClass('gap-8');

    const { container: gapCustom } = render(<PageColumns gap="gap-[20px]">Content</PageColumns>);
    expect(gapCustom.firstChild).toHaveClass('gap-[20px]');
  });

  it('has base responsive classes', () => {
    const { container } = render(<PageColumns>Content</PageColumns>);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('flex-col');
    expect(container.firstChild).toHaveClass('lg:flex-row');
  });
});
