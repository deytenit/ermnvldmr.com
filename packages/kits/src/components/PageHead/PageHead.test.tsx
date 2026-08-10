import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { PageHead } from './PageHead';

describe('PageHead', () => {
  it('renders heading and caption correctly', () => {
    render(<PageHead caption="Test Caption" heading="Test Heading" />);

    expect(screen.getAllByText('Test Heading').length).toBeGreaterThan(0);
    expect(screen.getByText('Test Caption')).toBeInTheDocument();
  });
});
