import React from 'react';

import { Text } from './Text';
import { VStack } from '../VStack/VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Text> = {
  title: 'components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['display', 'headline', 'title', 'body', 'label'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'error', 'muted', 'inherit'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'balance', 'pretty'],
    },
    overflow: {
      control: 'select',
      options: ['ellipsis', 'clip'],
    },
    maxLines: {
      control: 'number',
    },
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    type: 'body',
    size: 'm',
  },
};

export const Layout: Story = {
  render: () => (
    <VStack gap={4}>
      <div className="w-full max-w-md border p-4">
        <Text align="center" as="div">
          Centered Text
        </Text>
        <Text align="right" as="div">
          Right Aligned Text
        </Text>
        <Text align="justify" as="div">
          Justified text: The quick brown fox jumps over the lazy dog. This sentence is repeated to
          demonstrate justification behavior in a multi-line context. The quick brown fox jumps over
          the lazy dog.
        </Text>
      </div>
      <div className="w-full max-w-xs border p-4">
        <Text as="div" wrap="nowrap">
          Nowrap: The quick brown fox jumps over the lazy dog.
        </Text>
        <Text as="div" className="mt-4" wrap="balance">
          Balanced: This headline should be balanced across lines for better visual weight.
        </Text>
        <Text as="div" className="mt-4" wrap="pretty">
          Pretty: This paragraph uses text-wrap: pretty to avoid orphans at the end of the text
          block.
        </Text>
      </div>
    </VStack>
  ),
};

export const Truncation: Story = {
  render: () => (
    <VStack gap={4}>
      <div className="w-full max-w-[200px] border p-2">
        <Text as="div" overflow="ellipsis">
          Single line truncation with ellipsis.
        </Text>
      </div>
      <div className="w-full max-w-[200px] border p-2">
        <Text as="div" maxLines={2}>
          Multi-line clamping: this text will be truncated after two lines of content.
        </Text>
      </div>
    </VStack>
  ),
};

export const TypeScale: Story = {
  render: () => (
    <VStack gap={8}>
      <div>
        <Text className="mb-4 block uppercase tracking-widest" color="muted" size="s" type="label">
          Display
        </Text>
        <VStack gap={2}>
          <Text size="l" type="display">
            Display Large
          </Text>
          <Text size="m" type="display">
            Display Medium
          </Text>
          <Text size="s" type="display">
            Display Small
          </Text>
        </VStack>
      </div>
      <div>
        <Text className="mb-4 block uppercase tracking-widest" color="muted" size="s" type="label">
          Headline
        </Text>
        <VStack gap={2}>
          <Text size="l" type="headline">
            Headline Large
          </Text>
          <Text size="m" type="headline">
            Headline Medium
          </Text>
          <Text size="s" type="headline">
            Headline Small
          </Text>
        </VStack>
      </div>
      <div>
        <Text className="mb-4 block uppercase tracking-widest" color="muted" size="s" type="label">
          Title
        </Text>
        <VStack gap={2}>
          <Text size="l" type="title">
            Title Large
          </Text>
          <Text size="m" type="title">
            Title Medium
          </Text>
          <Text size="s" type="title">
            Title Small
          </Text>
        </VStack>
      </div>
      <div>
        <Text className="mb-4 block uppercase tracking-widest" color="muted" size="s" type="label">
          Body
        </Text>
        <VStack gap={2}>
          <Text size="l" type="body">
            Body Large
          </Text>
          <Text size="m" type="body">
            Body Medium
          </Text>
          <Text size="s" type="body">
            Body Small
          </Text>
        </VStack>
      </div>
      <div>
        <Text className="mb-4 block uppercase tracking-widest" color="muted" size="s" type="label">
          Label
        </Text>
        <VStack gap={2}>
          <Text size="l" type="label">
            Label Large
          </Text>
          <Text size="m" type="label">
            Label Medium
          </Text>
          <Text size="s" type="label">
            Label Small
          </Text>
        </VStack>
      </div>
    </VStack>
  ),
};

export const Colors: Story = {
  render: () => (
    <VStack gap={2}>
      <Text color="default">Default Text Color</Text>
      <Text color="primary">Primary Text Color</Text>
      <Text color="secondary">Secondary Text Color</Text>
      <Text color="tertiary">Tertiary Text Color</Text>
      <Text color="error">Error Text Color</Text>
      <Text color="muted">Muted Text Color</Text>
    </VStack>
  ),
};

export const Modifiers: Story = {
  render: () => (
    <VStack gap={2}>
      <Text bold>Bold Text</Text>
      <Text italic>Italic Text</Text>
      <Text underline>Underlined Text</Text>
      <Text strike>Strikethrough Text</Text>
      <Text bold italic underline>
        Combined Modifiers
      </Text>
    </VStack>
  ),
};
