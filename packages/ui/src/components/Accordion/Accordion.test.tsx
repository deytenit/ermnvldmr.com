import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders correctly with all sub-components', () => {
    render(
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger level={2}>Trigger 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    expect(screen.getByText('Trigger 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles content on click in single mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    const trigger1 = screen.getByText('Trigger 1');
    const trigger2 = screen.getByText('Trigger 2');

    await user.click(trigger1);
    expect(screen.getByRole('button', { name: /Trigger 1/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Trigger 2/i })).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger2);
    expect(screen.getByRole('button', { name: /Trigger 1/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Trigger 2/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows multiple items to be open in multiple mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    await user.click(screen.getByText('Trigger 1'));
    await user.click(screen.getByText('Trigger 2'));

    expect(screen.getByRole('button', { name: /Trigger 1/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Trigger 2/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('respects the collapsible prop in single mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion collapsible={false} type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    const trigger = screen.getByText('Trigger 1');
    
    // Open it
    await user.click(trigger);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');

    // Try to close it (should stay open because collapsible={false})
    await user.click(trigger);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <Accordion.Item disabled value="item-1">
          <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    const trigger = screen.getByText('Trigger 1');
    await user.click(trigger);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState<string[]>(['item-1']);
      return (
        <Accordion onValueChange={setValue} type="single" value={value}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
    };

    render(<TestComponent />);

    expect(screen.getByRole('button', { name: /Trigger 1/i })).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByText('Trigger 2'));
    expect(screen.getByRole('button', { name: /Trigger 1/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Trigger 2/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
