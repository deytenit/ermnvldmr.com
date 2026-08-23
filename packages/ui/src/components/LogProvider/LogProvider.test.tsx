import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useLogger } from './LogContext';
import { LogProvider } from './LogProvider';

function ConsumerComponent(): React.JSX.Element {
  const log = useLogger();
  return (
    <button type="button" onClick={() => log('test-event', { key: 'value' })}>
      Trigger Log
    </button>
  );
}

describe('LogProvider', () => {
  it('defaults to no-op when outside LogProvider', () => {
    render(<ConsumerComponent />);
    const button = screen.getByRole('button', { name: 'Trigger Log' });
    expect(() => button.click()).not.toThrow();
  });

  it('calls the provided logger on event dispatch', () => {
    const loggerMock = vi.fn();
    render(
      <LogProvider logger={loggerMock}>
        <ConsumerComponent />
      </LogProvider>
    );

    const button = screen.getByRole('button', { name: 'Trigger Log' });
    button.click();

    expect(loggerMock).toHaveBeenCalledWith('test-event', { key: 'value' });
  });
});
