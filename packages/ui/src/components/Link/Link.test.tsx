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

  it('automatically adds target="_blank" and rel for external links', () => {
    render(<Link href="https://example.com">External</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add target="_blank" for internal links by default', () => {
    render(<Link href="/articles">Internal</Link>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
  });

  it('respects explicit isExternal prop', () => {
    const { rerender } = render(
      <Link isExternal href="/internal">
        Force External
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');

    rerender(
      <Link href="https://external.com" isExternal={false}>
        Force Internal
      </Link>
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
  });

  it('renders as a button/span when no href is provided but has onPress', () => {
    render(<Link onPress={() => {}}>Click me</Link>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
