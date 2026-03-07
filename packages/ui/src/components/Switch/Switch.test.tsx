import userEvent from '@testing-library/user-event';

import { Switch } from './Switch';
import { render, screen } from '../../lib/testing';

describe('components/Switch', () => {
  it('renders correctly with label', () => {
    render(<Switch>Toggle Label</Switch>);
    expect(screen.getByLabelText('Toggle Label')).toBeInTheDocument();
    expect(screen.getByText('Toggle Label')).toBeInTheDocument();
  });

  it('handles change events', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange}>Switch</Switch>);

    const checkbox = screen.getByRole('switch');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('respects isSelected prop', () => {
    render(
      <Switch isSelected onChange={() => {}}>
        Switch
      </Switch>
    );
    const checkbox = screen.getByRole('switch');
    expect(checkbox).toBeChecked();
  });

  it('respects isDisabled prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Switch isDisabled onChange={handleChange}>
        Switch
      </Switch>
    );

    const checkbox = screen.getByRole('switch');
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
