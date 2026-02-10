import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import { Code } from './Code';
import { CodeBlock } from './CodeBlock/CodeBlock';

// Mock clipboard API
const mockWriteText = jest.fn().mockImplementation(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('Code Component', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  it('renders inline code correctly', () => {
    render(<Code>const x = 1;</Code>);
    const codeElement = screen.getByText('const x = 1;');
    expect(codeElement.tagName).toBe('CODE');
    expect(codeElement).toHaveClass('rounded-sm');
  });

  it('renders block code correctly', () => {
    render(
      <CodeBlock label="test.ts">
        <Code>
          <span>console.log(&quot;hello&quot;);</span>
        </Code>
      </CodeBlock>
    );
    // Should verify it's inside a pre tag
    const preElement = screen.getByText('console.log("hello");').closest('pre');
    expect(preElement).toBeInTheDocument();

    // Should see label
    expect(screen.getByText('test.ts')).toBeInTheDocument();
  });

  it('copies content on click in inline mode', async () => {
    render(<Code copyValue="copied!">Display Text</Code>);
    const codeElement = screen.getByText('Display Text');

    await act(async () => {
      fireEvent.click(codeElement);
      await Promise.resolve();
    });

    expect(mockWriteText).toHaveBeenCalledWith('copied!');
  });

  it('copies content via button in block mode', async () => {
    render(
      <CodeBlock copyValue="block copy">
        <Code>
          <span>some code</span>
        </Code>
      </CodeBlock>
    );

    const copyButton = screen.getByLabelText('Copy code');
    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
    });

    expect(mockWriteText).toHaveBeenCalledWith('block copy');
  });

  it('extracts text from children if copyValue is not provided', async () => {
    render(<Code>extracted</Code>);

    const codeElement = screen.getByText('extracted');
    await act(async () => {
      fireEvent.click(codeElement);
      await Promise.resolve();
    });

    expect(mockWriteText).toHaveBeenCalledWith('extracted');
  });
});
