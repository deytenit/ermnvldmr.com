import React from 'react';

import { Markdown } from './Markdown';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Markdown> = {
  title: 'Components/Markdown',
  component: Markdown,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

/**
 * A "Kitchen Sink" demonstration of all Markdown components working together
 * as they would in a real article.
 */
export const KitchenSink: Story = {
  render: () => (
    <div className="max-w-[800px] mx-auto">
      <Markdown>
        <Markdown.H1>The Art of Markdown Integration</Markdown.H1>
        <Markdown.P>
          This article demonstrates how our design system translates standard Markdown tags into
          beautiful, accessible UI primitives. From typography to complex data tables.
        </Markdown.P>

        <Markdown.Hr />

        <Markdown.H2>Typography & Vertical Rhythm</Markdown.H2>
        <Markdown.P>
          Our typography system is built on a strict vertical rhythm. Headers use the{' '}
          <Markdown.Code>Header</Markdown.Code> component, while paragraphs leverage the{' '}
          <Markdown.Code>Paragraph</Markdown.Code> component with pre-configured gutters.
        </Markdown.P>

        <Markdown.Blockquote>
          &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
          <br />
          <Markdown.A href="https://en.wikipedia.org/wiki/Steve_Jobs">— Steve Jobs</Markdown.A>
        </Markdown.Blockquote>

        <Markdown.H3>Nesting and Lists</Markdown.H3>
        <Markdown.P>
          Lists are handled by our <Markdown.Code>List</Markdown.Code> system, supporting both
          ordered and unordered variants:
        </Markdown.P>

        <Markdown.Ul>
          <Markdown.Li>Standardization across all articles</Markdown.Li>
          <Markdown.Li>
            Support for nested structures:
            <Markdown.Ul className="mt-2">
              <Markdown.Li>Nested unordered item</Markdown.Li>
              <Markdown.Li>Another nested item</Markdown.Li>
            </Markdown.Ul>
          </Markdown.Li>
          <Markdown.Li>Consistent spacing and markers</Markdown.Li>
        </Markdown.Ul>

        <Markdown.H2>Code & Technical Content</Markdown.H2>
        <Markdown.P>
          Technical articles often require code blocks. We use{' '}
          <Markdown.Code>CodeBlock</Markdown.Code> for multi-line snippets:
        </Markdown.P>

        <Markdown.Pre label="markdown-example.tsx">
          <Markdown.Code>
            {`export const MarkdownP = memo(function MarkdownP(props: ParagraphProps) {
  return <Paragraph gutterBottom {...props} />;
});`}
          </Markdown.Code>
        </Markdown.Pre>

        <Markdown.H2>Data Representation</Markdown.H2>
        <Markdown.P>
          Tables are notoriously difficult to style in Markdown. Our components ensure they stay
          within the container and maintain readable density.
        </Markdown.P>

        <Markdown.Table>
          <Markdown.THead>
            <Markdown.Tr>
              <Markdown.Th>Component</Markdown.Th>
              <Markdown.Th>Tag</Markdown.Th>
              <Markdown.Th>Status</Markdown.Th>
            </Markdown.Tr>
          </Markdown.THead>
          <Markdown.TBody>
            <Markdown.Tr>
              <Markdown.Td>MarkdownP</Markdown.Td>
              <Markdown.Td>
                <Markdown.Code>p</Markdown.Code>
              </Markdown.Td>
              <Markdown.Td>Verified</Markdown.Td>
            </Markdown.Tr>
            <Markdown.Tr>
              <Markdown.Td>MarkdownTable</Markdown.Td>
              <Markdown.Td>
                <Markdown.Code>table</Markdown.Code>
              </Markdown.Td>
              <Markdown.Td>Verified</Markdown.Td>
            </Markdown.Tr>
          </Markdown.TBody>
        </Markdown.Table>

        <Markdown.H2>Visual Assets</Markdown.H2>
        <Markdown.Img
          alt="Atmospheric landscape"
          ratio="16/9"
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1600"
          width="100%"
        />
      </Markdown>
    </div>
  ),
};

/**
 * Specifically showcases the header hierarchy from H1 to H6.
 */
export const HeaderHierarchy: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Markdown.H1>Header Level 1</Markdown.H1>
      <Markdown.H2>Header Level 2</Markdown.H2>
      <Markdown.H3>Header Level 3</Markdown.H3>
      <Markdown.H4>Header Level 4</Markdown.H4>
      <Markdown.H5>Header Level 5</Markdown.H5>
      <Markdown.H6>Header Level 6</Markdown.H6>
    </div>
  ),
};

/**
 * Demonstrates various list types and their spacing.
 */
export const ListStyles: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Markdown.H4 className="mb-4">Unordered List</Markdown.H4>
        <Markdown.Ul>
          <Markdown.Li>First item</Markdown.Li>
          <Markdown.Li>Second item</Markdown.Li>
          <Markdown.Li>Third item</Markdown.Li>
        </Markdown.Ul>
      </div>
      <div>
        <Markdown.H4 className="mb-4">Ordered List</Markdown.H4>
        <Markdown.Ol>
          <Markdown.Li>Step one: Preparation</Markdown.Li>
          <Markdown.Li>Step two: Implementation</Markdown.Li>
          <Markdown.Li>Step three: Verification</Markdown.Li>
        </Markdown.Ol>
      </div>
    </div>
  ),
};

/**
 * Showcases code blocks with language-specific syntax highlighting.
 */
export const CodeLanguages: Story = {
  render: () => (
    <div className="max-w-[800px] mx-auto space-y-8">
      <div>
        <Markdown.H3 className="mb-4">TypeScript</Markdown.H3>
        <Markdown.Pre label="example.ts">
          <Markdown.Code className="language-typescript">
            {`interface User {
  id: number;
  name: string;
}

const greet = (user: User) => {
  console.log(\`Hello, \${user.name}!\`);
};`}
          </Markdown.Code>
        </Markdown.Pre>
      </div>

      <div>
        <Markdown.H3 className="mb-4">Rust</Markdown.H3>
        <Markdown.Pre label="main.rs">
          <Markdown.Code className="language-rust">
            {`fn main() {
    let name = "World";
    println!("Hello, {}!", name);
}`}
          </Markdown.Code>
        </Markdown.Pre>
      </div>

      <div>
        <Markdown.H3 className="mb-4">Python</Markdown.H3>
        <Markdown.Pre label="script.py">
          <Markdown.Code className="language-python">
            {`def greet(name: str):
    print(f"Hello, {name}!")

if __name__ == "__main__":
    greet("World")`}
          </Markdown.Code>
        </Markdown.Pre>
      </div>

      <div>
        <Markdown.H3 className="mb-4">JSON</Markdown.H3>
        <Markdown.Pre label="data.json">
          <Markdown.Code className="language-json">
            {`{
  "project": "ermnvldmr.com",
  "version": "1.0.0",
  "private": true
}`}
          </Markdown.Code>
        </Markdown.Pre>
      </div>
    </div>
  ),
};
