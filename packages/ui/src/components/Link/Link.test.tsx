import React from 'react';
import { vi } from 'vitest';

import { Link } from './Link';
import { render, screen, fireEvent } from '../../lib/testing';

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
    expect(link).toHaveStyle({ animationDelay: '500ms', animationFillMode: 'both' });
    expect(link).toHaveClass('animate-in');
  });

  it('obfuscates mailto link until user interaction', () => {
    render(
      <Link isObfuscated href="mailto:personal@ermnvldmr.com">
        personal@ermnvldmr.com
      </Link>
    );
    const link = screen.getByRole('link', { name: 'personal@ermnvldmr.com' });
    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveAttribute('data-user', 'personal');
    expect(link).toHaveAttribute('data-domain', 'ermnvldmr.com');

    fireEvent.pointerEnter(link);
    expect(link).toHaveAttribute('href', 'mailto:personal@ermnvldmr.com');
  });
});
