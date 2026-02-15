import React from 'react';

import { Breadcrumbs } from './Breadcrumbs';
import { render, screen } from '../../lib/testing';
import { Link } from '../Link/Link';

describe('components/Breadcrumbs', () => {
  it('renders correctly with multiple items and separators', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item>
          <Link href="/">Home</Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator variant="slash" />
        <Breadcrumbs.Item>Current</Breadcrumbs.Item>
      </Breadcrumbs>
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('supports different separator variants', () => {
    const { rerender } = render(
      <Breadcrumbs>
        <Breadcrumbs.Separator data-testid="sep" variant="bull" />
      </Breadcrumbs>
    );
    expect(screen.getByTestId('sep')).toHaveTextContent('•');

    rerender(
      <Breadcrumbs>
        <Breadcrumbs.Separator data-testid="sep" variant="slash" />
      </Breadcrumbs>
    );
    expect(screen.getByTestId('sep')).toHaveTextContent('/');
  });
});
