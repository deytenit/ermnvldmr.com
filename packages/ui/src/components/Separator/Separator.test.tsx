import React from 'react';

import { Separator } from './Separator';
import { render, screen } from '../../lib/testing';

describe('Separator', () => {
  it('renders a single horizontal separator by default', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separator).toHaveClass('border-t');
  });

  it('renders a single vertical separator', () => {
    render(<Separator direction="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('border-l');
  });

  it('applies an explicit color override', () => {
    render(<Separator color="black" />);
    expect(screen.getByRole('separator')).toHaveClass('border-foreground');
  });

  it('applies the thinned gradient mask by default and omits it when disabled', () => {
    const { rerender } = render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep').className).toContain('mask-image');

    rerender(<Separator data-testid="sep" thinned="none" />);
    expect(screen.getByTestId('sep').className).not.toContain('mask-image');
  });

  it('renders a double horizontal separator with two lines', () => {
    const { container } = render(<Separator type="double" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('renders a double vertical separator laid out in a row', () => {
    const { container } = render(<Separator direction="vertical" type="double" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('flex-row');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('forwards data-testid and merges a custom className', () => {
    render(<Separator className="my-custom-class" data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveClass('my-custom-class');
  });
});
