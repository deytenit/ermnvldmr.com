import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PageRoot } from './PageRoot';

describe('PageRoot', () => {
  it('renders children correctly', () => {
    render(
      <PageRoot>
        <div data-testid="child">Test Content</div>
      </PageRoot>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageRoot className="custom-class">
        <div>Content</div>
      </PageRoot>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has base technical classes', () => {
    const { container } = render(
      <PageRoot>
        <div>Content</div>
      </PageRoot>
    );
    expect(container.firstChild).toHaveClass('w-full');
  });
});
