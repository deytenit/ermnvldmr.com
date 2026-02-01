import React from 'react';

import { Link } from './Link';
import { render, screen } from '../../test-utils';

describe('components/Link', () => {
  it('renders correctly as a link when href is provided', () => {
    render(<Link href="https://example.com">Click me</Link>);
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('text-[var(--rb-ring)]');
  });

  it('renders as a button/span when no href is provided but has onPress', () => {
    render(<Link onPress={() => {}}>Click me</Link>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
