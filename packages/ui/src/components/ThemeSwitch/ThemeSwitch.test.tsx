import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ThemeSwitch } from './ThemeSwitch';
import { render, screen } from '../../lib/testing';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('components/ThemeSwitch', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders correctly', () => {
    render(<ThemeSwitch />);
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow system theme')).toBeInTheDocument();
  });

  it('toggles theme when switch is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(window.localStorage.getItem('ermnvldmr/ui/lib/theme')).toContain('dark');
  });

  it('sets system theme when auto is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const autoButton = screen.getByLabelText('Follow system theme');
    await user.click(autoButton);

    expect(window.localStorage.getItem('ermnvldmr/ui/lib/theme')).toContain('system');
  });
});
