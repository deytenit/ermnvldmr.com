import { render, screen } from '@testing-library/react';
import React from 'react';

import { Blockquote } from './Blockquote';

describe('Blockquote', () => {
  it('renders children correctly', () => {
    render(<Blockquote>Quote content</Blockquote>);
    expect(screen.getByText('Quote content')).toBeInTheDocument();
  });

  it('renders as a blockquote element', () => {
    const { container } = render(<Blockquote>Quote</Blockquote>);
    expect(container.querySelector('blockquote')).toBeInTheDocument();
  });

  it('applies gutterBottom class when prop is true', () => {
    const { container } = render(<Blockquote gutterBottom>Quote</Blockquote>);
    expect(container.querySelector('blockquote')).toHaveClass('mb-6');
  });

  it('applies inset styles when variant is inset', () => {
    const { container } = render(<Blockquote variant="inset">Quote</Blockquote>);
    expect(container.querySelector('blockquote')).toHaveClass('bg-[var(--rb-surface-variant)]');
  });

  it('renders citation with prefix', () => {
    render(
      <Blockquote>
        Quote
        <Blockquote.Citation>Author Name</Blockquote.Citation>
      </Blockquote>
    );
    expect(screen.getByText('— Author Name')).toBeInTheDocument();
  });
});
