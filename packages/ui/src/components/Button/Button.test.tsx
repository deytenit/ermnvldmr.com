import React from 'react';

import { Button } from './Button';
import { render, screen, fireEvent } from '../../test-utils';

describe('components/Button', () => {
  it('renders correctly as a button by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders correctly as an anchor when href is provided', () => {
    render(<Button href="https://example.com">Link Button</Button>);
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('calls onPress when clicked in button mode', () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = vi.fn();
    render(
      <Button isDisabled onPress={onPress}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('renders start and end icons correctly', () => {
    const StartIcon = (className: string) => (
      <span className={className} data-testid="start-icon" />
    );
    const EndIcon = (className: string) => <span className={className} data-testid="end-icon" />;

    render(
      <Button renderEndIcon={EndIcon} renderStartIcon={StartIcon}>
        Icon Button
      </Button>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('Icon Button')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="s">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="l">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('applies correct rounded classes', () => {
    const { rerender } = render(<Button rounded="full">Pill</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-full');

    rerender(<Button rounded="none">Square</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-none');

    rerender(<Button rounded="md">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-md');
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
