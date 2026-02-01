import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import { Code } from './Code';

// Mock clipboard API
const mockWriteText = jest.fn();
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
    render(<Code variant="inline">const x = 1;</Code>);
    const codeElement = screen.getByText('const x = 1;');
    expect(codeElement.tagName).toBe('CODE');
    expect(codeElement).toHaveClass('rounded-sm');
  });

  it('renders block code correctly', () => {
    render(
      <Code label="test.ts" variant="block">
        <span>console.log(&quot;hello&quot;);</span>
      </Code>
    );
    // Should verify it's inside a pre tag
    const preElement = screen.getByText('console.log("hello");').closest('pre');
    expect(preElement).toBeInTheDocument();

    // Should see label
    expect(screen.getByText('test.ts')).toBeInTheDocument();
  });

  it('copies content on click in inline mode', () => {
    render(
      <Code copyValue="copied!" variant="inline">
        Display Text
      </Code>
    );
    const codeElement = screen.getByText('Display Text');

    act(() => {
      fireEvent.click(codeElement);
    });

    expect(mockWriteText).toHaveBeenCalledWith('copied!');
  });

  it('copies content via button in block mode', () => {
    render(
      <Code copyValue="block copy" variant="block">
        <span>some code</span>
      </Code>
    );

    const copyButton = screen.getByLabelText('Copy code');
    act(() => {
      fireEvent.click(copyButton);
    });

    expect(mockWriteText).toHaveBeenCalledWith('block copy');
  });

  it('extracts text from children if copyValue is not provided', () => {
    render(<Code variant="inline">extracted</Code>);

    const codeElement = screen.getByText('extracted');
    act(() => {
      fireEvent.click(codeElement);
    });

    expect(mockWriteText).toHaveBeenCalledWith('extracted');
  });
});
