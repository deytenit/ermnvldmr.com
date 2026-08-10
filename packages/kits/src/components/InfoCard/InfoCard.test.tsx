import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { InfoCard } from './InfoCard';

describe('InfoCard', () => {
  it('renders header, body, and footer content', () => {
    render(
      <InfoCard data-testid="info-card">
        <InfoCard.Header>Card Header</InfoCard.Header>
        <InfoCard.Body>Card Body Content</InfoCard.Body>
        <InfoCard.Footer>Card Footer Content</InfoCard.Footer>
      </InfoCard>
    );

    expect(screen.getByTestId('info-card')).toBeInTheDocument();
    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Card Body Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer Content')).toBeInTheDocument();
  });

  it('renders primary variant correctly', () => {
    render(
      <InfoCard data-testid="info-card-primary" variant="primary">
        <InfoCard.Header>Primary Title</InfoCard.Header>
      </InfoCard>
    );

    const card = screen.getByTestId('info-card-primary');
    expect(card).toHaveClass('bg-primary');
  });

  it('renders accordion list sections', () => {
    render(
      <InfoCard>
        <InfoCard.List
          sections={[
            {
              value: 'sec1',
              label: 'Section 1',
              items: ['Item A', 'Item B'],
            },
          ]}
        />
      </InfoCard>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  it('renders InfoCard.Image with title and description overlay', () => {
    render(
      <InfoCard.Image
        alt="Test Image"
        className="custom-img"
        overlayDescription="Image Overlay Description"
        overlayTitle="Image Overlay Title"
        src="/test-image.jpg"
      />
    );

    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Image Overlay Title')).toBeInTheDocument();
    expect(screen.getByText('Image Overlay Description')).toBeInTheDocument();
  });

  it('renders accordion list sections with object items', () => {
    render(
      <InfoCard>
        <InfoCard.List
          sections={[
            {
              value: 'sec1',
              label: 'Section 1',
              items: [
                { key: 'obj-item-key', node: 'Object Item Content' },
                { node: 'Object Item Without Key' },
                <span key="jsx-key">JSX Item Content</span>,
                <span>JSX Element Without Key</span>,
              ],
            },
          ]}
        />
      </InfoCard>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  it('forwards ref to underlying DOM element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<InfoCard ref={ref}>Card Content</InfoCard>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe('Card Content');
  });
});

