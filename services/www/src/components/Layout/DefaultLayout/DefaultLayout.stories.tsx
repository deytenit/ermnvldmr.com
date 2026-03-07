import { Header, Paragraph, VStack, PageColumns, PageColumn } from '@ermnvldmr/ui';
import React from 'react';

import { DefaultLayout } from './DefaultLayout';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DefaultLayout> = {
  title: 'WWW/Layout/DefaultLayout',
  component: DefaultLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DefaultLayout>;

const StoryPage = () => (
  <VStack className="py-12" gap={8}>
    <VStack gap={4}>
      <Header level={1}>Default Layout Shell</Header>
      <Paragraph size="l">
        This is the standard site shell used for most pages in the www service. It includes the
        common Header, a constrained PageContainer for content, and the persistent Footer with the
        rainbow peek.
      </Paragraph>
    </VStack>

    <PageColumns gap={8}>
      <PageColumn size="full">
        <VStack gap={4}>
          <Header level={2}>Main Content Area</Header>
          <Paragraph>
            The main content area is automatically wrapped in a PageContainer, ensuring it stays
            centered and follows the site&apos;s width constraints.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Paragraph>
        </VStack>
      </PageColumn>
      <PageColumn size="small">
        <VStack className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-lg" gap={4}>
          <Header level={3}>Sidebar</Header>
          <Paragraph size="s">
            This sidebar is placed inside a PageColumn with size=&quot;small&quot;.
          </Paragraph>
        </VStack>
      </PageColumn>
    </PageColumns>
  </VStack>
);

/**
 * Standard width layout.
 */
export const Default: Story = {
  args: {
    children: <StoryPage />,
    width: 'default',
  },
};

/**
 * Slim width layout, often used for reading-heavy pages.
 */
export const Slim: Story = {
  args: {
    children: <StoryPage />,
    width: 'slim',
  },
};

/**
 * Vertically centered layout, perfect for landing page sections or simple welcome screens.
 */
export const Centered: Story = {
  args: {
    children: (
      <VStack align="center" className="text-center" gap={6}>
        <Header level={1}>Welcome Home</Header>
        <Paragraph size="l">
          This content is perfectly centered vertically in the viewport. The footer is still peeking
          at the bottom.
        </Paragraph>
      </VStack>
    ),
    centerVertically: true,
  },
};

/**
 * Demonstration of the "Long Page" behavior where the footer is pushed below the fold.
 */
export const LongPage: Story = {
  args: {
    children: (
      <VStack className="py-12" gap={8}>
        <Header level={1}>Scroll Down to see the Footer</Header>
        {Array.from({ length: 10 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Paragraph key={i}>
            Scrollable block {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Paragraph>
        ))}
      </VStack>
    ),
  },
};
