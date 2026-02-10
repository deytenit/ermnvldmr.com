import { render, screen } from '@testing-library/react';
import React from 'react';

import { Markdown, MARKDOWN_COMPONENTS } from './Markdown';

describe('Markdown Components', () => {
  it('renders various markdown components correctly', () => {
    render(
      <Markdown>
        <Markdown.H1>Heading 1</Markdown.H1>
        <Markdown.P>This is a paragraph.</Markdown.P>
        <Markdown.A href="https://example.com">Link</Markdown.A>
        <Markdown.UL>
          <Markdown.LI>Item 1</Markdown.LI>
        </Markdown.UL>
        <Markdown.Table>
          <Markdown.THead>
            <Markdown.TR>
              <Markdown.TH>Header</Markdown.TH>
            </Markdown.TR>
          </Markdown.THead>
          <Markdown.TBody>
            <Markdown.TR>
              <Markdown.TD>Cell</Markdown.TD>
            </Markdown.TR>
          </Markdown.TBody>
        </Markdown.Table>
      </Markdown>
    );

    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell')).toHaveTextContent('Cell');
  });

  it('MARKDOWN_COMPONENTS map contains all necessary tags', () => {
    expect(MARKDOWN_COMPONENTS.p).toBeDefined();
    expect(MARKDOWN_COMPONENTS.h1).toBeDefined();
    expect(MARKDOWN_COMPONENTS.table).toBeDefined();
    expect(MARKDOWN_COMPONENTS.pre).toBeDefined();
    expect(MARKDOWN_COMPONENTS.code).toBeDefined();
  });
});
