import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { BentoGrid } from './BentoGrid';

describe('BentoGrid', () => {
  it('renders children correctly inside grid container', () => {
    render(
      <BentoGrid data-testid="bento-grid">
        <div>Item 1</div>
        <div>Item 2</div>
      </BentoGrid>
    );

    const grid = screen.getByTestId('bento-grid');
    expect(grid).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <BentoGrid className="custom-class" data-testid="bento-grid">
        <div>Content</div>
      </BentoGrid>
    );

    const grid = screen.getByTestId('bento-grid');
    expect(grid).toHaveClass('custom-class');
  });
});
