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

  it('renders breadcrumbs and addons in both expanded and collapsed views', () => {
    render(
      <PageHead
        addonLeft={<span>Logo Left</span>}
        addonRight={<span>Nav Menu</span>}
        breadcrumbs={<span>Breadcrumbs Trail</span>}
        heading="Wanted"
      />
    );

    expect(screen.getAllByText('Breadcrumbs Trail').length).toBe(2);
    expect(screen.getAllByText('Nav Menu').length).toBe(2);
    expect(screen.getAllByText('Logo Left').length).toBe(2);
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
