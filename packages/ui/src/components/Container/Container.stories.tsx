import React from 'react';

import { Container } from './Container';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Container> = {
  title: 'components/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    bg: {
      control: 'select',
      options: ['base', 'primary', 'secondary', 'tertiary', 'error', 'muted', 'transparent'],
    },
    padding: {
      control: 'number',
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'none'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: 'This is a container with some content.',
    padding: 4,
    bg: 'base',
    border: true,
    rounded: 'md',
  },
};

export const SemanticColors: Story = {
  render: () => (
    <VStack gap={4}>
      <Container border bg="base" padding={4} rounded="md">
        Base Surface
      </Container>
      <Container bg="primary" padding={4} rounded="md">
        Primary Surface
      </Container>
      <Container bg="secondary" padding={4} rounded="md">
        Secondary Surface
      </Container>
      <Container bg="tertiary" padding={4} rounded="md">
        Tertiary Surface
      </Container>
      <Container bg="error" padding={4} rounded="md">
        Error Surface
      </Container>
      <Container bg="muted" padding={4} rounded="md">
        Muted Surface
      </Container>
      <Container border bg="transparent" padding={4} rounded="md">
        Transparent Surface
      </Container>
    </VStack>
  ),
};

export const PaddingScale: Story = {
  render: () => (
    <VStack gap={4}>
      <Container border bg="muted" padding={1}>
        Padding 1
      </Container>
      <Container border bg="muted" padding={2}>
        Padding 2
      </Container>
      <Container border bg="muted" padding={4}>
        Padding 4
      </Container>
      <Container border bg="muted" padding={8}>
        Padding 8
      </Container>
      <Container border bg="muted" padding={12}>
        Padding 12
      </Container>
    </VStack>
  ),
};

export const MaxWidths: Story = {
  render: () => (
    <VStack className="w-full" gap={4}>
      <Container bg="tertiary" maxWidth="sm" padding={4} rounded="md">
        Max Width SM (640px)
      </Container>
      <Container bg="tertiary" maxWidth="md" padding={4} rounded="md">
        Max Width MD (768px)
      </Container>
      <Container bg="tertiary" maxWidth="lg" padding={4} rounded="md">
        Max Width LG (1024px)
      </Container>
      <Container bg="tertiary" maxWidth="xl" padding={4} rounded="md">
        Max Width XL (1280px)
      </Container>
    </VStack>
  ),
};

export const Rounding: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Container bg="secondary" padding={8} rounded="none">
        None
      </Container>
      <Container bg="secondary" padding={8} rounded="sm">
        Small
      </Container>
      <Container bg="secondary" padding={8} rounded="md">
        Medium
      </Container>
      <Container bg="secondary" padding={8} rounded="lg">
        Large
      </Container>
      <Container bg="secondary" padding={8} rounded="full">
        Full
      </Container>
    </div>
  ),
};

export const ElevationAndBorders: Story = {
  render: () => (
    <VStack gap={8}>
      <Container border bg="base" padding={6} rounded="lg">
        Border Only
      </Container>
      <Container shadow bg="base" padding={6} rounded="lg">
        Shadow Only
      </Container>
      <Container border shadow bg="base" padding={6} rounded="lg">
        Border + Shadow
      </Container>
    </VStack>
  ),
};

export const Composition: Story = {
  render: () => (
    <Container border shadow bg="base" maxWidth="md" padding={0} rounded="lg">
      <Container bg="primary" padding={4} rounded="none">
        <Text bold color="inherit" size="l" type="title">
          Card Header
        </Text>
      </Container>
      <Container padding={6}>
        <VStack gap={4}>
          <Text size="m" type="body">
            This example demonstrates how containers can be nested and composed. The outer container
            has a shadow and border, while the header uses a primary background.
          </Text>
          <Container border bg="muted" padding={4} rounded="md">
            <Text size="m" type="label">
              Inside a nested muted container
            </Text>
          </Container>
        </VStack>
      </Container>
    </Container>
  ),
};
