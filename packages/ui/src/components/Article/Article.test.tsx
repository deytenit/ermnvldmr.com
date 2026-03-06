import React from 'react';

import { Article } from './Article';
import { render, screen } from '../../lib/testing';

describe('components/Article', () => {
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

  it('renders separators correctly based on subHeadline presence', () => {
    const { rerender } = render(<Article headline="Title">Body</Article>);
    let separators = screen.getAllByRole('separator');
    expect(separators).toHaveLength(1);
    expect(separators[0].className).toContain('mask-image');

    rerender(
      <Article headline="Title" subHeadline="Sub">
        Body
      </Article>
    );
    separators = screen.getAllByRole('separator');
    expect(separators).toHaveLength(2);
    expect(separators[0].className).not.toContain('mask-image');
    expect(separators[1].className).toContain('mask-image');
  });

  it('renders as a link when href is provided', () => {
    render(
      <Article {...props} href="/test-article">
        Article body content
      </Article>
    );

    const articleContainer = screen.getByText('Breaking News').closest('a');
    expect(articleContainer).toBeInTheDocument();
    expect(articleContainer).toHaveAttribute('href', '/test-article');
  });
});
