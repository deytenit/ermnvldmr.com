import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { Code } from './Code';
import { CodeBlock } from './CodeBlock/CodeBlock';

// Mock shiki
vi.mock('shiki', () => ({
  createHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi
      .fn()
      .mockReturnValue('<pre><code><span class="line">highlighted code</span></code></pre>'),
  }),
}));

// Mock clipboard API
const mockWriteText = vi.fn().mockImplementation(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('Code Component', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    vi.clearAllMocks();
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

  it('copies content on click in inline mode', () => {
    render(<Code copyValue="copied!">Display Text</Code>);
    const codeElement = screen.getByText('Display Text');

    act(() => {
      fireEvent.click(codeElement);
    });

    expect(mockWriteText).toHaveBeenCalledWith('copied!');
  });

  it('copies content via button in block mode', () => {
    render(
      <CodeBlock copyValue="block copy">
        <Code>
          <span>some code</span>
        </Code>
      </CodeBlock>
    );

    const copyButton = screen.getByLabelText('Copy code');
    act(() => {
      fireEvent.click(copyButton);
    });

    expect(mockWriteText).toHaveBeenCalledWith('block copy');
  });

  it('extracts text from children if copyValue is not provided', () => {
    render(<Code>extracted</Code>);

    const codeElement = screen.getByText('extracted');
    act(() => {
      fireEvent.click(codeElement);
    });

    expect(mockWriteText).toHaveBeenCalledWith('extracted');
  });

  it('uses shiki for highlighting when language is provided in block mode', async () => {
    act(() => {
      render(
        <CodeBlock language="typescript">
          <Code>const x: number = 1;</Code>
        </CodeBlock>
      );
    });

    // Wait for shiki async highlighting
    const highlighted = await screen.findByText('highlighted code');
    expect(highlighted).toBeInTheDocument();
  });
});
