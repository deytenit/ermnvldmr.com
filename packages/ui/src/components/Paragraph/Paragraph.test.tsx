import React from 'react';

import { Paragraph } from './Paragraph';
import { render, screen } from '../../test-utils';

describe('components/Paragraph', () => {
  it('renders as a p tag by default', () => {
    render(<Paragraph>Content</Paragraph>);
    expect(screen.getByText('Content').tagName).toBe('P');
  });

  it('applies gutterBottom', () => {
    render(<Paragraph gutterBottom>Content</Paragraph>);
    expect(screen.getByText('Content')).toHaveClass('mb-4');
  });

  it('applies indent', () => {
    render(<Paragraph indent>Content</Paragraph>);
    expect(screen.getByText('Content')).toHaveClass('indent-8');
  });

  it('passes through Text props like align', () => {
    render(<Paragraph align="center">Content</Paragraph>);
    expect(screen.getByText('Content')).toHaveClass('text-center');
  });
});
