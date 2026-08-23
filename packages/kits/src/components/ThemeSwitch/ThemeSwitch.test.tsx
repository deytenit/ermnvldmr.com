import { LogProvider } from '@ermnvldmr/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch', () => {
  it('renders theme switch controls correctly', () => {
    render(
      <ThemeSwitch
        darkIcon={<span data-testid="dark-icon" />}
        lightIcon={<span data-testid="light-icon" />}
        systemIcon={<span data-testid="system-icon" />}
      />
    );

    expect(screen.getByTestId('light-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dark-icon')).toBeInTheDocument();
    expect(screen.getByTestId('system-icon')).toBeInTheDocument();

    const switchControl = screen.getByRole('switch');
    expect(switchControl).toBeInTheDocument();

    const systemButton = screen.getByRole('button');
    expect(systemButton).toBeInTheDocument();
  });

  it('handles interaction with switch and system button', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const switchControl = screen.getByRole('switch');
    const systemButton = screen.getByRole('button');

    await user.click(switchControl);
    await user.click(systemButton);

    expect(systemButton).toBeInTheDocument();
  });

  it('dispatches telemetry events to LogProvider', async () => {
    const user = userEvent.setup();
    const loggerMock = vi.fn();

    render(
      <LogProvider logger={loggerMock}>
        <ThemeSwitch />
      </LogProvider>
    );

    const switchControl = screen.getByRole('switch');
    const systemButton = screen.getByRole('button');

    await user.click(switchControl);
    expect(loggerMock).toHaveBeenCalledWith('theme-toggle', { preference: 'dark' });

    await user.click(systemButton);
    expect(loggerMock).toHaveBeenCalledWith('theme-toggle', { preference: 'system' });
  });
});
