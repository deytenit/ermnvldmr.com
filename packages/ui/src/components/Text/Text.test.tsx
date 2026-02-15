import React from 'react';

import { Text } from './Text';
import { render, screen } from '../../lib/testing';

describe('components/Text', () => {
  it('renders children correctly', () => {
    render(<Text>Test content</Text>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies alignment classes', () => {
    render(<Text align="center">Centered</Text>);
    expect(screen.getByText('Centered')).toHaveClass('text-center');
  });

  it('applies wrap classes', () => {
    render(<Text wrap="balance">Balanced</Text>);
    expect(screen.getByText('Balanced')).toHaveClass('text-balance');
  });

  it('applies maxLines (line-clamp)', () => {
    render(<Text maxLines={3}>Clamped</Text>);
    expect(screen.getByText('Clamped')).toHaveClass('line-clamp-3');
  });

  it('applies overflow ellipsis (truncate)', () => {
    render(<Text overflow="ellipsis">Truncated</Text>);
    expect(screen.getByText('Truncated')).toHaveClass('truncate');
  });

  it('maxLines takes precedence over overflow', () => {
    render(
      <Text maxLines={2} overflow="ellipsis">
        Priority
      </Text>
    );
    const el = screen.getByText('Priority');
    expect(el).toHaveClass('line-clamp-2');
    expect(el).not.toHaveClass('truncate');
  });
});
