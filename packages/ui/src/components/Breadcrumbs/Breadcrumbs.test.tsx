import React from 'react';

import { Breadcrumbs } from './Breadcrumbs';
import { render, screen, fireEvent } from '../../lib/testing';
import { Link } from '../Link/Link';

describe('components/Breadcrumbs', () => {
  it('renders correctly with multiple items and separators', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item>
          <Link href="/">Home</Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator variant="slash" />
        <Breadcrumbs.Item isCurrent>Current</Breadcrumbs.Item>
      </Breadcrumbs>
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    
    const currentItem = screen.getByText('Current').parentElement;
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('supports isCurrent state', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item isCurrent>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    const item = screen.getByText('Current Page').parentElement;
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('supports href directly on Item', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/test-url">Test Link</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveAttribute('href', '/test-url');
  });

  it('supports onClick on Item', () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item onClick={handleClick}>Clickable</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    const button = screen.getByRole('button', { name: 'Clickable' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
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
