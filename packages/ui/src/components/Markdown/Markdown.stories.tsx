import { Markdown } from './Markdown';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Metadata for the Markdown component stories.
 */
const meta: Meta<typeof Markdown> = {
  title: 'components/Markdown',
  component: Markdown,
  tags: ['autodocs'],
};

export default meta;

/**
 * Type definition for Markdown component stories.
 */
type Story = StoryObj<typeof Markdown>;

/**
 * Default story showcasing various HTML elements to verify typography.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <p>
          This is a <strong>Markdown</strong> component that uses Tailwind CSS Typography (prose) 
          to render content with consistent styling.
        </p>
        <p>
          It is designed to be used with rendered HTML from markdown processors, 
          but works with any HTML content that needs standard document styling.
        </p>
      </>
    ),
  },
};

/**
 * Showcasing all heading levels.
 */
export const Typography: Story = {
  args: {
    children: (
      <>
        <h1>Heading Level 1</h1>
        <p>Paragraph text following an H1.</p>
        <h2>Heading Level 2</h2>
        <p>Paragraph text following an H2.</p>
        <h3>Heading Level 3</h3>
        <p>Paragraph text following an H3.</p>
        <h4>Heading Level 4</h4>
        <p>Paragraph text following an H4.</p>
        <h5>Heading Level 5</h5>
        <p>Paragraph text following an H5.</p>
        <h6>Heading Level 6</h6>
        <p>Paragraph text following an H6.</p>
      </>
    ),
  },
};

/**
 * Showcasing ordered and unordered lists.
 */
export const Lists: Story = {
  args: {
    children: (
      <>
        <h3>Unordered List</h3>
        <ul>
          <li>First item</li>
          <li>Second item
            <ul>
              <li>Nested item A</li>
              <li>Nested item B</li>
            </ul>
          </li>
          <li>Third item</li>
        </ul>

        <h3>Ordered List</h3>
        <ol>
          <li>Step one</li>
          <li>Step two
            <ol>
              <li>Sub-step 2.1</li>
              <li>Sub-step 2.2</li>
            </ol>
          </li>
          <li>Step three</li>
        </ol>
      </>
    ),
  },
};

/**
 * Showcasing blockquotes.
 */
export const Quotes: Story = {
  args: {
    children: (
      <>
        <p>Before the quote.</p>
        <blockquote>
          &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
          <footer>— Steve Jobs</footer>
        </blockquote>
        <p>After the quote.</p>
      </>
    ),
  },
};

/**
 * Showcasing code and pre blocks.
 */
export const Code: Story = {
  args: {
    children: (
      <>
        <p>
          You can use <code>inline code</code> for small snippets.
        </p>
        <pre>
          <code>{`function hello() {
  console.log("Hello, world!");
}`}</code>
        </pre>
      </>
    ),
  },
};

/**
 * Showcasing tables.
 */
export const Tables: Story = {
  args: {
    children: (
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Typography</td>
            <td>Garamond and Lato fonts</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td>Dark Mode</td>
            <td>Automatic inversion</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td>Responsive</td>
            <td>Fluid layouts</td>
            <td>✅ Done</td>
          </tr>
        </tbody>
      </table>
    ),
  },
};

/**
 * The "Kitchen Sink" containing everything.
 */
export const KitchenSink: Story = {
  args: {
    children: (
      <>
        <h1>The Art of Markdown Rendering</h1>
        <p className="lead">
          A lead paragraph that stands out and sets the tone for the rest of the document.
        </p>
        <p>
          Markdown is a lightweight markup language with plain-text-formatting syntax. 
          Its design allows it to be converted to many output formats, but the name 
          originally referred to the tool for converting it to HTML.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Easy to read</strong> - The source text looks like the final output.</li>
          <li><strong>Easy to write</strong> - Minimal syntax overhead.</li>
          <li><strong>Versatile</strong> - Supports many elements like <em>italics</em>, <del>strikethrough</del>, and <code>code</code>.</li>
        </ul>

        <h3>Example Code Block</h3>
        <pre>
          <code>{`import { Markdown } from '@ermnvldmr/ui';

export const MyPage = () => (
  <Markdown>
    <h1>Welcome</h1>
    <p>This is styled automatically.</p>
  </Markdown>
);`}</code>
        </pre>

        <blockquote>
          &quot;Simplicity is the ultimate sophistication.&quot;
          <br />
          — Leonardo da Vinci
        </blockquote>

        <hr />

        <h2>Data Representation</h2>
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Difficulty</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TypeScript</td>
              <td>Moderate</td>
              <td>Frontend/Backend</td>
            </tr>
            <tr>
              <td>Rust</td>
              <td>High</td>
              <td>Systems</td>
            </tr>
            <tr>
              <td>Python</td>
              <td>Low</td>
              <td>Data Science</td>
            </tr>
          </tbody>
        </table>

        <h3>Media Elements</h3>
        <p>Images should be rounded and have a nice shadow.</p>
        <img alt="Coding" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" />

        <p>Conclusion: We&apos;ve built a robust system for rendering content.</p>
      </>
    ),
  },
};
