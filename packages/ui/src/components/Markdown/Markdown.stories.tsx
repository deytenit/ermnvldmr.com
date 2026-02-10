import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Markdown, MARKDOWN_COMPONENTS } from './Markdown';

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
        <MARKDOWN_COMPONENTS.h1>The Art of Markdown Integration</MARKDOWN_COMPONENTS.h1>
        <MARKDOWN_COMPONENTS.p>
          This article demonstrates how our design system translates standard Markdown tags into
          beautiful, accessible UI primitives. From typography to complex data tables.
        </MARKDOWN_COMPONENTS.p>

        <MARKDOWN_COMPONENTS.hr />

        <MARKDOWN_COMPONENTS.h2>Typography & Vertical Rhythm</MARKDOWN_COMPONENTS.h2>
        <MARKDOWN_COMPONENTS.p>
          Our typography system is built on a strict vertical rhythm. Headers use the{' '}
          <MARKDOWN_COMPONENTS.code>Header</MARKDOWN_COMPONENTS.code> component, while paragraphs
          leverage the <MARKDOWN_COMPONENTS.code>Paragraph</MARKDOWN_COMPONENTS.code> component with
          pre-configured gutters.
        </MARKDOWN_COMPONENTS.p>

        <MARKDOWN_COMPONENTS.blockquote>
          "Design is not just what it looks like and feels like. Design is how it works."
          <br />
          <MARKDOWN_COMPONENTS.a href="https://en.wikipedia.org/wiki/Steve_Jobs">— Steve Jobs</MARKDOWN_COMPONENTS.a>
        </MARKDOWN_COMPONENTS.blockquote>

        <MARKDOWN_COMPONENTS.h3>Nesting and Lists</MARKDOWN_COMPONENTS.h3>
        <MARKDOWN_COMPONENTS.p>
          Lists are handled by our <MARKDOWN_COMPONENTS.code>List</MARKDOWN_COMPONENTS.code> system,
          supporting both ordered and unordered variants:
        </MARKDOWN_COMPONENTS.p>

        <MARKDOWN_COMPONENTS.ul>
          <MARKDOWN_COMPONENTS.li>Standardization across all articles</MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>
            Support for nested structures:
            <MARKDOWN_COMPONENTS.ul className="mt-2">
              <MARKDOWN_COMPONENTS.li>Nested unordered item</MARKDOWN_COMPONENTS.li>
              <MARKDOWN_COMPONENTS.li>Another nested item</MARKDOWN_COMPONENTS.li>
            </MARKDOWN_COMPONENTS.ul>
          </MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>Consistent spacing and markers</MARKDOWN_COMPONENTS.li>
        </MARKDOWN_COMPONENTS.ul>

        <MARKDOWN_COMPONENTS.h2>Code & Technical Content</MARKDOWN_COMPONENTS.h2>
        <MARKDOWN_COMPONENTS.p>
          Technical articles often require code blocks. We use{' '}
          <MARKDOWN_COMPONENTS.code>CodeBlock</MARKDOWN_COMPONENTS.code> for multi-line snippets:
        </MARKDOWN_COMPONENTS.p>

        <MARKDOWN_COMPONENTS.pre label="markdown-example.tsx">
          <MARKDOWN_COMPONENTS.code>
            {`export const MarkdownP = memo(function MarkdownP(props: ParagraphProps) {
  return <Paragraph gutterBottom {...props} />;
});`}
          </MARKDOWN_COMPONENTS.code>
        </MARKDOWN_COMPONENTS.pre>

        <MARKDOWN_COMPONENTS.h2>Data Representation</MARKDOWN_COMPONENTS.h2>
        <MARKDOWN_COMPONENTS.p>
          Tables are notoriously difficult to style in Markdown. Our components ensure they stay
          within the container and maintain readable density.
        </MARKDOWN_COMPONENTS.p>

        <MARKDOWN_COMPONENTS.table>
          <MARKDOWN_COMPONENTS.thead>
            <MARKDOWN_COMPONENTS.tr>
              <MARKDOWN_COMPONENTS.th>Component</MARKDOWN_COMPONENTS.th>
              <MARKDOWN_COMPONENTS.th>Tag</MARKDOWN_COMPONENTS.th>
              <MARKDOWN_COMPONENTS.th>Status</MARKDOWN_COMPONENTS.th>
            </MARKDOWN_COMPONENTS.tr>
          </MARKDOWN_COMPONENTS.thead>
          <MARKDOWN_COMPONENTS.tbody>
            <MARKDOWN_COMPONENTS.tr>
              <MARKDOWN_COMPONENTS.td>MarkdownP</MARKDOWN_COMPONENTS.td>
              <MARKDOWN_COMPONENTS.td>
                <MARKDOWN_COMPONENTS.code>p</MARKDOWN_COMPONENTS.code>
              </MARKDOWN_COMPONENTS.td>
              <MARKDOWN_COMPONENTS.td>Verified</MARKDOWN_COMPONENTS.td>
            </MARKDOWN_COMPONENTS.tr>
            <MARKDOWN_COMPONENTS.tr>
              <MARKDOWN_COMPONENTS.td>MarkdownTable</MARKDOWN_COMPONENTS.td>
              <MARKDOWN_COMPONENTS.td>
                <MARKDOWN_COMPONENTS.code>table</MARKDOWN_COMPONENTS.code>
              </MARKDOWN_COMPONENTS.td>
              <MARKDOWN_COMPONENTS.td>Verified</MARKDOWN_COMPONENTS.td>
            </MARKDOWN_COMPONENTS.tr>
          </MARKDOWN_COMPONENTS.tbody>
        </MARKDOWN_COMPONENTS.table>

        <MARKDOWN_COMPONENTS.h2>Visual Assets</MARKDOWN_COMPONENTS.h2>
        <MARKDOWN_COMPONENTS.img
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
      <MARKDOWN_COMPONENTS.h1>Header Level 1</MARKDOWN_COMPONENTS.h1>
      <MARKDOWN_COMPONENTS.h2>Header Level 2</MARKDOWN_COMPONENTS.h2>
      <MARKDOWN_COMPONENTS.h3>Header Level 3</MARKDOWN_COMPONENTS.h3>
      <MARKDOWN_COMPONENTS.h4>Header Level 4</MARKDOWN_COMPONENTS.h4>
      <MARKDOWN_COMPONENTS.h5>Header Level 5</MARKDOWN_COMPONENTS.h5>
      <MARKDOWN_COMPONENTS.h6>Header Level 6</MARKDOWN_COMPONENTS.h6>
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
        <MARKDOWN_COMPONENTS.h4 className="mb-4">Unordered List</MARKDOWN_COMPONENTS.h4>
        <MARKDOWN_COMPONENTS.ul>
          <MARKDOWN_COMPONENTS.li>First item</MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>Second item</MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>Third item</MARKDOWN_COMPONENTS.li>
        </MARKDOWN_COMPONENTS.ul>
      </div>
      <div>
        <MARKDOWN_COMPONENTS.h4 className="mb-4">Ordered List</MARKDOWN_COMPONENTS.h4>
        <MARKDOWN_COMPONENTS.ol>
          <MARKDOWN_COMPONENTS.li>Step one: Preparation</MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>Step two: Implementation</MARKDOWN_COMPONENTS.li>
          <MARKDOWN_COMPONENTS.li>Step three: Verification</MARKDOWN_COMPONENTS.li>
        </MARKDOWN_COMPONENTS.ol>
      </div>
    </div>
  ),
};
