import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Time } from './Time';

describe('Time', () => {
  it('renders formatted date correctly', () => {
    const testDate = new Date('2026-08-09T12:00:00Z');
    render(<Time date={testDate} locale="en-US" />);

    const timeElement = screen.getByText(/2026/);
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName.toLowerCase()).toBe('time');
  });
});
