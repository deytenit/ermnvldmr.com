import React from 'react';

import { Article } from './Article';
import { render, screen } from '../../test-utils';

describe('components/paper/Article', () => {
  const props = {
    headline: 'Breaking News',
    subHeadline: 'Local cat saves city',
    additionalText: 'Reporting by John Doe',
  };

  it('renders all parts of the article', () => {
    render(<Article {...props}>Article body content</Article>);
    
    expect(screen.getByText('Breaking News')).toBeInTheDocument();
    expect(screen.getByText('Local cat saves city')).toBeInTheDocument();
    expect(screen.getByText('Article body content')).toBeInTheDocument();
    expect(screen.getByText('Reporting by John Doe')).toBeInTheDocument();
  });

  it('renders separators only when appropriate', () => {
    const { rerender } = render(<Article headline="Title">Body</Article>);
    // Should have 1 separator (between title and body)
    expect(screen.getAllByRole('separator')).toHaveLength(1);

    rerender(<Article headline="Title" subHeadline="Sub">Body</Article>);
    // Should have 2 separators (Title-Sub and Sub-Body)
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });
});
