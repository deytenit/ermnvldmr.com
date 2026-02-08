import React from 'react';

import { Table } from './Table';
import { TableContainer } from './testing/TableContainer/TableContainer';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    variant: {
      control: 'select',
      options: ['surface', 'outline', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const TableTemplate = (args: any) => (
  <TableContainer variant={args.variant === 'ghost' ? 'ghost' : 'surface'}>
    <Table {...args}>
      <Table.Caption>A list of recent transactions.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[100px]">Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head align="right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="font-medium">INV001</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
          <Table.Cell>Credit Card</Table.Cell>
          <Table.Cell align="right">$250.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-medium">INV002</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
          <Table.Cell>PayPal</Table.Cell>
          <Table.Cell align="right">$150.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-medium">INV003</Table.Cell>
          <Table.Cell>Unpaid</Table.Cell>
          <Table.Cell>Bank Transfer</Table.Cell>
          <Table.Cell align="right">$350.00</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>Total</Table.Cell>
          <Table.Cell align="right">$750.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  </TableContainer>
);

export const Default: Story = {
  args: {
    density: 'm',
    variant: 'surface',
    striped: false,
    hoverable: true,
  },
  render: TableTemplate,
};

export const Striped: Story = {
  args: {
    ...Default.args,
    striped: true,
  },
  render: TableTemplate,
};

export const Compact: Story = {
  args: {
    ...Default.args,
    density: 's',
  },
  render: TableTemplate,
};

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
    hoverable: true,
  },
  render: TableTemplate,
};

export const Grid: Story = {
  args: {
    ...Default.args,
    grid: true,
  },
  render: TableTemplate,
};

export const BorderedCells: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <TableContainer>
      <Table {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head border="right">Header with Right Border</Table.Head>
            <Table.Head>Standard Header</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell border="all">All Borders</Table.Cell>
            <Table.Cell border="x">X-Axis Borders</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell border="y">Y-Axis Borders</Table.Cell>
            <Table.Cell border="left">Left Border Only</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableContainer>
  ),
};

export const ContentCellLayouts: Story = {
  args: {
    density: 'm',
    variant: 'outline',
  },

  render: () => (
    <TableContainer>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>User</Table.Head>
            <Table.Head>Details</Table.Head>
            <Table.Head>Balance</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Table.Content gap="m">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  JD
                </div>
                <Table.Content gap="s" layout="stack">
                  <span className="font-bold">Jane Doe</span>
                  <span className="text-xs text-[var(--rb-muted-text)]">Admin</span>
                </Table.Content>
              </Table.Content>
            </Table.Cell>
            <Table.Cell>
              <Table.Content maxLines={2}>
                This is a very long description that should be truncated by the content helper after
                two lines.
              </Table.Content>
            </Table.Cell>
            <Table.Cell>
              <Table.Content variant="numeric">$10,240.50</Table.Content>
            </Table.Cell>
            <Table.Cell>
              <Table.Content variant="icon">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </Table.Content>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableContainer>
  ),
};
