import React from 'react';
import { vi } from 'vitest';

import { Link } from './Link';
import { render, screen } from '../../lib/testing';

describe('components/Link', () => {
  beforeEach(() => {
    // Mock IntersectionObserver to avoid errors in Text component
    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('passes delay prop to the underlying Text component', () => {
    render(
      <Link delay={500} href="/test">
        Delayed Link
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('opacity-0');
  });
});
