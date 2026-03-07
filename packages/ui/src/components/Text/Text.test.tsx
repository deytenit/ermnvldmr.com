import React from 'react';
import { vi } from 'vitest';

import { Text } from './Text';
import { render, screen, act } from '../../lib/testing';

describe('components/Text', () => {
  let intersectionCallback: (entries: any[]) => void;

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock IntersectionObserver
    class MockIntersectionObserver {
      constructor(public callback: (entries: any[]) => void) {
        intersectionCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders children correctly', () => {
    render(<Text>Test content</Text>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('is immediately visible when no delay is provided', () => {
    render(<Text>No delay</Text>);
    const el = screen.getByText('No delay');
    expect(el).not.toHaveClass('opacity-0');
    expect(el).not.toHaveClass('animate-in');
  });

  it('is initially hidden when delay is provided', () => {
    render(<Text delay={500}>With delay</Text>);
    const el = screen.getByText('With delay');
    expect(el).toHaveClass('opacity-0');
  });

  it('becomes visible after intersection and specified delay', () => {
    render(<Text delay={500}>Delayed visible</Text>);
    const el = screen.getByText('Delayed visible');

    expect(el).toHaveClass('opacity-0');

    // Simulate intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    // Should still be hidden before delay
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(el).toHaveClass('opacity-0');

    // Should be visible after delay
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(el).not.toHaveClass('opacity-0');
    expect(el).toHaveClass('animate-in');
    expect(el).toHaveClass('fade-in');
  });

  it('becomes visible immediately after intersection if delay is 0', () => {
    render(<Text delay={0}>Zero delay</Text>);
    const el = screen.getByText('Zero delay');

    expect(el).toHaveClass('opacity-0');

    // Simulate intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    expect(el).not.toHaveClass('opacity-0');
    expect(el).toHaveClass('animate-in');
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

  it('applies type="button" by default when as="button"', () => {
    render(<Text as="button">Button Text</Text>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows overriding type attribute with htmlType', () => {
    render(
      <Text as="button" htmlType="submit">
        Submit Text
      </Text>
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
