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
        <Markdown.Ul>
          <Markdown.Li>Item 1</Markdown.Li>
        </Markdown.Ul>
        <Markdown.Table>
          <Markdown.THead>
            <Markdown.Tr>
              <Markdown.Th>Header</Markdown.Th>
            </Markdown.Tr>
          </Markdown.THead>
          <Markdown.TBody>
            <Markdown.Tr>
              <Markdown.Td>Cell</Markdown.Td>
            </Markdown.Tr>
          </Markdown.TBody>
        </Markdown.Table>
      </Markdown>
    );

    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('This is a paragraph.')).toHaveClass('mb-4');
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
