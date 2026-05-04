import { render, screen } from '@testing-library/react';
import React from 'react';

import { BentoGrid } from './BentoGrid';

describe('BentoGrid', () => {
  it('renders all card types correctly', () => {
    render(
      <BentoGrid>
        <BentoGrid.BaseCard data-testid="base-card">Base Card Content</BentoGrid.BaseCard>
        <BentoGrid.ImageCard
          src="test-image.jpg"
          alt="Test Image"
          overlayTitle="Image Title"
          overlayDescription="Image Description"
        />
        <BentoGrid.InfoCard
          title="Info Title"
          description="Info Description"
          footer={<span>Footer Content</span>}
        />
        <BentoGrid.CTACard
          title="CTA Title"
          description="CTA Description"
          buttonText="Click Me"
          href="/test"
        />
        <BentoGrid.ListCard
          title="List Title"
          description="List Description"
          sections={[
            {
              value: 's1',
              label: 'Section 1',
              items: ['Item A', 'Item B']
            }
          ]}
        />
      </BentoGrid>
    );

    // BaseCard
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
          variant="primary"
          title="Primary CTA"
          description="Description"
          buttonText="Button"
          href="/"
        />
      </BentoGrid>
    );

    const title = screen.getByText('Primary CTA');
    const card = title.closest('.bg-rb-primary-base');
    expect(card).toBeInTheDocument();
  });
});
