import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders markdown sub-components correctly', () => {
    render(
      <Markdown>
        <Markdown.H1>Hello Markdown</Markdown.H1>
        <Markdown.P>This is a paragraph.</Markdown.P>
      </Markdown>
    );

    expect(screen.getByText('Hello Markdown')).toBeInTheDocument();
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
  });
});
