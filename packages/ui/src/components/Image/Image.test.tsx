import React from 'react';

import { Image } from './Image';
import { render, screen, fireEvent } from '../../test-utils';

describe('components/Image', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Example image',
    width: '300px',
    height: '200px',
  };

  it('renders with correct dimensions for CLS safety', () => {
    render(<Image {...defaultProps} />);
    const wrapper = screen.getByTestId('image-wrapper');
    expect(wrapper).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('renders with aspect ratio when provided', () => {
    render(<Image alt="test" ratio="16/9" src="test.jpg" width="100%" />);
    const wrapper = screen.getByTestId('image-wrapper');
    expect(wrapper).toHaveStyle({ width: '100%', aspectRatio: '16/9' });
  });

  it('shows stub while loading and hides it after load', () => {
    render(<Image {...defaultProps} />);

    // Stub should be visible
    expect(screen.getByTestId('stub')).toBeInTheDocument();
    const img = screen.getByTestId('image-element');
    expect(img).toHaveClass('opacity-0');

    // Simulate load
    fireEvent.load(img);

    // Image should be visible (opacity-100)
    expect(img).toHaveClass('opacity-100');
    // Stub is removed from DOM when isLoaded is true in implementation
    expect(screen.queryByTestId('stub')).not.toBeInTheDocument();
  });

  it('stops stub animation on error', () => {
    render(<Image {...defaultProps} />);
    const img = screen.getByTestId('image-element');

    // Simulate error
    fireEvent.error(img);

    // Stub should be present but not animating
    const stub = screen.getByTestId('stub');
    expect(stub).not.toHaveClass('animate-shimmer');
  });

  it('applies rounding and shadow classes', () => {
    render(<Image {...defaultProps} rounded="full" shadow="lg" />);
    const wrapper = screen.getByTestId('image-wrapper');
    expect(wrapper).toHaveClass('rounded-full');
    expect(wrapper).toHaveClass('shadow-lg');
  });

  it('passes correct attributes to native img tag', () => {
    render(<Image {...defaultProps} />);
    const img = screen.getByTestId('image-element');
    expect(img).toHaveAttribute('src', defaultProps.src);
    expect(img).toHaveAttribute('alt', defaultProps.alt);
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });
});
