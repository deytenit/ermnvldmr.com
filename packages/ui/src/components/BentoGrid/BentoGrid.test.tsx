import { render, screen } from '@testing-library/react';
import React from 'react';

import { BentoGrid } from './BentoGrid';

describe('BentoGrid', () => {
  it('renders all card types correctly', () => {
    render(
      <BentoGrid>
        <BentoGrid.BaseCard data-testid="base-card">Base Card Content</BentoGrid.BaseCard>
        <BentoGrid.ImageCard
          alt="Test Image"
          overlayDescription="Image Description"
          overlayTitle="Image Title"
          src="test-image.jpg"
        />
        <BentoGrid.InfoCard
          description="Info Description"
          footer={<span>Footer Content</span>}
          title="Info Title"
        />
        <BentoGrid.CTACard
          buttonText="Click Me"
          description="CTA Description"
          href="/test"
          title="CTA Title"
        />
        <BentoGrid.ListCard
          description="List Description"
          sections={[
            {
              value: 's1',
              label: 'Section 1',
              items: ['Item A', 'Item B']
            }
          ]}
          title="List Title"
        />
      </BentoGrid>
    );

    // BaseCard
    expect(screen.getByTestId('base-card')).toBeInTheDocument();
    expect(screen.getByText('Base Card Content')).toBeInTheDocument();

    // ImageCard
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Image Title')).toBeInTheDocument();
    expect(screen.getByText('Image Description')).toBeInTheDocument();

    // InfoCard
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info Description')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();

    // CTACard
    expect(screen.getByText('CTA Title')).toBeInTheDocument();
    expect(screen.getByText('CTA Description')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Click Me/i })).toHaveAttribute('href', '/test');

    // ListCard
    expect(screen.getByText('List Title')).toBeInTheDocument();
    expect(screen.getByText('List Description')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('renders ListCard with object items (stable keys)', () => {
    render(
      <BentoGrid.ListCard
        sections={[
          {
            value: 's1',
            label: 'Section 1',
            items: [
              { key: 'item-1', node: 'Stable Item 1' },
              'Raw Item 2'
            ]
          }
        ]}
        title="List Title"
      />
    );

    expect(screen.getByText('Stable Item 1')).toBeInTheDocument();
    expect(screen.getByText('Raw Item 2')).toBeInTheDocument();
  });

  it('applies span classes correctly', () => {
    render(
      <BentoGrid>
        <BentoGrid.BaseCard colSpan={2} rowSpan={2}>
          Spanning Card
        </BentoGrid.BaseCard>
      </BentoGrid>
    );

    const card = screen.getByText('Spanning Card');
    expect(card).toHaveClass('md:col-span-2');
    expect(card).toHaveClass('md:row-span-2');
  });

  it('applies primary variant to CTACard', () => {
    render(
      <BentoGrid>
        <BentoGrid.CTACard
          buttonText="Button"
          description="Description"
          href="/"
          title="Primary CTA"
          variant="primary"
        />
      </BentoGrid>
    );

    const title = screen.getByText('Primary CTA');
    const card = title.closest('.bg-rb-primary-base');
    expect(card).toBeInTheDocument();
  });
});
