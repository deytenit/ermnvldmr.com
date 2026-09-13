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

  it('renders breadcrumbs, addonLeft, and addonRight', () => {
    render(
      <PageHead
        addonLeft={<span>Left Addon</span>}
        addonRight={<span>Right Addon</span>}
        breadcrumbs={<span>Breadcrumbs Trail</span>}
        heading="Test Heading"
      />
    );

    expect(screen.getByText('Breadcrumbs Trail')).toBeInTheDocument();
    expect(screen.getAllByText('Left Addon').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Right Addon').length).toBeGreaterThan(0);
  });

  it('renders correctly with always-collapsed-fixed strategy', () => {
    render(
      <PageHead
        addonLeft={<span>Brand Logo</span>}
        addonRight={<nav>Nav Links</nav>}
        heading="Home Page"
        strategy="always-collapsed-fixed"
      />
    );

    expect(screen.getAllByText('Brand Logo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nav Links').length).toBeGreaterThan(0);
  });
});
