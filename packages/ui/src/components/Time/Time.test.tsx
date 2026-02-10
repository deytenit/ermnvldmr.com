import React from 'react';

import { Time } from './Time';
import { render, screen } from '../../test-utils';

describe('components/Time', () => {
  it('renders correctly with a Date object', () => {
    const date = new Date('2026-02-10T00:00:00Z');
    render(<Time date={date} />);

    const timeElement = screen.getByText(/February 10, 2026/i);
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('datetime', date.toISOString());
  });

  it('renders correctly with an ISO string', () => {
    const dateString = '2026-02-10T00:00:00Z';
    render(<Time date={dateString} />);

    const timeElement = screen.getByText(/February 10, 2026/i);
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('datetime', new Date(dateString).toISOString());
  });

  it('respects custom children', () => {
    const date = new Date('2026-02-10T00:00:00Z');
    render(<Time date={date}>Custom Date Display</Time>);

    const timeElement = screen.getByText('Custom Date Display');
    expect(timeElement).toHaveAttribute('datetime', date.toISOString());
  });

  it('applies custom formatting options', () => {
    const date = new Date('2026-02-10T00:00:00Z');
    render(
      <Time
        date={date}
        formatOptions={{ year: '2-digit', month: 'short', day: 'numeric' }}
      />
    );

    // Depending on locale, "Feb 10, 26" or similar
    expect(screen.getByText(/Feb/i)).toBeInTheDocument();
    expect(screen.getByText(/10/i)).toBeInTheDocument();
    expect(screen.getByText(/26/i)).toBeInTheDocument();
  });

  it('passes text props correctly', () => {
    const date = new Date('2026-02-10T00:00:00Z');
    render(<Time bold color="primary" date={date} size="l" />);

    const timeElement = screen.getByText(/February 10, 2026/i);
    expect(timeElement).toHaveClass('font-bold');
    expect(timeElement).toHaveClass('text-[var(--rb-primary-text)]');
  });
});
