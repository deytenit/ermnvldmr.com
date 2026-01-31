import React from 'react';

import { Breadcrumbs } from './Breadcrumbs';
import { Link } from '../Link/Link';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'components/generic/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item>
        <Link href="/">Home</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="slash" />
      <Breadcrumbs.Item>
        <Link href="/blog">Blog</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="slash" />
      <Breadcrumbs.Item>Modern Web Design</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const WithArrows: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item>
        <Link href="/">Home</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="arrow" />
      <Breadcrumbs.Item>
        <Link href="/docs">Docs</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="arrow" />
      <Breadcrumbs.Item>Components</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const WithBullets: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item>
        <Link href="/">Home</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="bull" />
      <Breadcrumbs.Item>
        <Link href="/about">About</Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator variant="bull" />
      <Breadcrumbs.Item>Team</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};
