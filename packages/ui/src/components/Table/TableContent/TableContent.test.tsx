import { render, screen } from '@testing-library/react';
import React from 'react';

import { TableContent } from './TableContent';

describe('TableContent', () => {
  it('renders correctly', () => {
    render(<TableContent>Content</TableContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies stack layout', () => {
    render(<TableContent layout="stack">Stack</TableContent>);
    expect(screen.getByText('Stack')).toHaveClass('flex-col');
  });

  it('applies truncate class', () => {
    render(<TableContent truncate>Truncated</TableContent>);
    expect(screen.getByText('Truncated')).toHaveClass('truncate');
  });
});
