import { render, screen } from '@testing-library/react';
import React from 'react';

import { PageHead } from './PageHead';

describe('PageHead', () => {
  it('renders the heading and caption', () => {
    render(<PageHead caption="Test Caption" heading="Test Heading" />);
    // Both layouts are rendered (one hidden), so we use getAllByText
    expect(screen.getAllByText('Test Heading')[0]).toBeInTheDocument();
    expect(screen.getByText('Test Caption')).toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', () => {
    render(<PageHead breadcrumbs={<div>My Breadcrumbs</div>} heading="Test" />);
    expect(screen.getByText('My Breadcrumbs')).toBeInTheDocument();
  });

  it('renders addons when provided', () => {
    render(
      <PageHead
        addonLeft={<div>Left Addon</div>}
        addonRight={<div>Right Addon</div>}
        heading="Test"
      />
    );
    // Addons are rendered in both layouts
    expect(screen.getAllByText('Left Addon')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Right Addon')[0]).toBeInTheDocument();
  });

  it('applies the correct classes for the strategy', () => {
    render(<PageHead heading="Test" strategy="always-collapsed-fixed" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed');
    expect(header).not.toHaveClass('sticky');
  });
});
