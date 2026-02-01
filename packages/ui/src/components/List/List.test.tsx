import { render, screen } from '@testing-library/react';
import React from 'react';

import { List } from './List';

describe('List', () => {
  it('renders children correctly', () => {
    render(
      <List>
        <List.Item>Item 1</List.Item>
      </List>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders as ul by default', () => {
    const { container } = render(
      <List>
        <List.Item>Item 1</List.Item>
      </List>
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('applies ordered styles', () => {
    const { container } = render(
      <List variant="ordered">
        <List.Item>1</List.Item>
      </List>
    );
    expect(container.querySelector('ol')).toHaveClass('list-decimal');
  });

  it('applies spacing', () => {
    const { container } = render(
      <List spacing="m">
        <List.Item>1</List.Item>
      </List>
    );
    expect(container.firstChild).toHaveClass('gap-2');
  });

  it('renders custom marker', () => {
    render(
      <List marker={<span data-testid="custom-marker">*</span>}>
        <List.Item>Item 1</List.Item>
      </List>
    );
    expect(screen.getByTestId('custom-marker')).toBeInTheDocument();
  });

  it('item marker overrides list marker', () => {
    render(
      <List marker={<span>Global</span>}>
        <List.Item marker={<span data-testid="item-marker">Item</span>}>Item 1</List.Item>
      </List>
    );
    expect(screen.getByTestId('item-marker')).toBeInTheDocument();
    expect(screen.queryByText('Global')).not.toBeInTheDocument();
  });
});
