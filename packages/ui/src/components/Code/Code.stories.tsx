import { Code } from './Code';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Code> = {
  title: 'Components/Code',
  component: Code,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['block', 'inline'],
    },
    showLineNumbers: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Code>;

// Helper to simulate highlighted lines
const MockHighlightedCode = () => (
  <>
    <span className="block text-[var(--rb-primary-text)]">
      import React from &apos;react&apos;;
    </span>
    <span className="block text-[var(--rb-text)]"> </span>
    <span className="block text-[var(--rb-secondary-text)]">
      export const MyComponent = () =&gt; &#123;
    </span>
    <span className="block text-[var(--rb-text)] pl-4">
      return &lt;div&gt;Hello World&lt;/div&gt;;
    </span>
    <span className="block text-[var(--rb-secondary-text)]">&#125;;</span>
  </>
);

const LongHighlightedCode = () => (
  <>
    {Array.from({ length: 50 }).map((_, i) => (
      <span key={`line-${String(i)}`} className="block">
        <span className="text-[var(--rb-tertiary-text)]">line_{i + 1}</span>:{' '}
        <span className="text-[var(--rb-text)]">const x = {Math.random()};</span>
      </span>
    ))}
  </>
);

export const DefaultBlock: Story = {
  args: {
    children: <MockHighlightedCode />,
    variant: 'block',
    label: 'MyComponent.tsx',
  },
};

export const WithoutLabel: Story = {
  args: {
    children: <MockHighlightedCode />,
    variant: 'block',
    showLineNumbers: true,
  },
};

export const WithoutLineNumbers: Story = {
  args: {
    children: <MockHighlightedCode />,
    variant: 'block',
    showLineNumbers: false,
    label: 'no-lines.js',
  },
};

export const Inline: Story = {
  args: {
    children: 'npm install @ermnvldmr/ui',
    variant: 'inline',
  },
};

export const LongWithScroll: Story = {
  args: {
    children: <LongHighlightedCode />,
    variant: 'block',
    label: 'long-file.ts',
    maxHeight: '300px',
  },
};

export const PlainText: Story = {
  args: {
    children: `const simple = "string content";
console.log(simple);`,
    variant: 'block',
    label: 'plain-text.js',
    // Note: Line numbers won't work automatically on plain text unless we split it into elements
    // This story demonstrates behavior with raw text (counters will count the single text node as 1 line or 0)
    showLineNumbers: false,
  },
};
