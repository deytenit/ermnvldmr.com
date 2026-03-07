import React from 'react';

import { Code } from './Code';
import { CodeBlock } from './CodeBlock/CodeBlock';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Code',
  tags: ['autodocs'],
};

export default meta;

// Helper to simulate highlighted lines
const MockHighlightedCode = () => (
  <Code>
    <span className="block text-[var(--rb-primary-text)]">
      import React from &apos;react&apos;;
    </span>
    <span className="block text-[var(--rb-text)]"> </span>
    <span className="block text-[var(--rb-secondary-text)]">
      export const MyComponent = () =&gt; &#123;
    </span>
    <span className="block text-[var(--rb-text)]">
      {'    '}return &lt;div&gt;Hello World&lt;/div&gt;;
    </span>
    <span className="block text-[var(--rb-secondary-text)]">&#125;;</span>
  </Code>
);

const LongHighlightedCode = () => (
  <Code>
    {Array.from({ length: 50 }).map((_, i) => (
      <span key={`line-${String(i)}`} className="block">
        <span className="text-[var(--rb-tertiary-text)]">line_{i + 1}</span>:{' '}
        <span className="text-[var(--rb-text)]">const x = {Math.random()};</span>
      </span>
    ))}
  </Code>
);

export const DefaultBlock: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <MockHighlightedCode />
    </CodeBlock>
  ),
  args: {
    label: 'MyComponent.tsx',
  },
};

export const WithoutLabel: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <MockHighlightedCode />
    </CodeBlock>
  ),
  args: {
    showLineNumbers: true,
  },
};

export const WithoutLineNumbers: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <MockHighlightedCode />
    </CodeBlock>
  ),
  args: {
    showLineNumbers: false,
    label: 'no-lines.js',
  },
};

export const Inline: StoryObj<typeof Code> = {
  render: (args) => <Code {...args}>npm install @ermnvldmr/ui</Code>,
};

export const LongWithScroll: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <LongHighlightedCode />
    </CodeBlock>
  ),
  args: {
    label: 'long-file.ts',
    maxHeight: '300px',
  },
};

export const ShikiHighlight: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <Code>
        {`import React from 'react';

export const MyComponent = () => {
  return <div>Hello World</div>;
};`}
      </Code>
    </CodeBlock>
  ),
  args: {
    label: 'ShikiHighlight.tsx',
    language: 'tsx',
  },
};

export const PlainText: StoryObj<typeof CodeBlock> = {
  render: (args) => (
    <CodeBlock {...args}>
      <Code>
        {`const simple = "string content";
console.log(simple);`}
      </Code>
    </CodeBlock>
  ),
  args: {
    label: 'plain-text.js',
    showLineNumbers: false,
  },
};
