import userEvent from '@testing-library/user-event';
import React from 'react';

import { Button } from './Button';
import { render, screen } from '../../../test-utils';

/**
 * Test suite for the newspaper-style Button component
 */
describe('components/paper-kit/Button/Button', () => {
  const defaultProps = {
    children: 'Test Button',
  };

  it('renders correctly with default props', () => {
    render(<Button {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('applies correct styling classes', () => {
    render(<Button {...defaultProps} />);
    
    const button = screen.getByRole('button');
    
    // Check for key newspaper styling classes
    expect(button).toHaveClass('italic');
    expect(button).toHaveClass('underline');
    expect(button).toHaveClass('font-medium');
    expect(button).toHaveClass('bg-background');
    expect(button).toHaveClass('cursor-pointer');
  });

  it('handles click events through onPress prop', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
    
    render(<Button onPress={handlePress}>{defaultProps.children}</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <Button variant="primary">{defaultProps.children}</Button>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    
    rerender(<Button variant="secondary">{defaultProps.children}</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('handles disabled state correctly', () => {
    render(<Button isDisabled>{defaultProps.children}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('does not trigger onPress when disabled', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
    
    render(
      <Button isDisabled onPress={handlePress}>
        {defaultProps.children}
      </Button>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('supports custom className prop', () => {
    const customClass = 'custom-button-class';
    
    render(<Button className={customClass}>{defaultProps.children}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('supports data-testid prop', () => {
    const testId = 'my-test-button';
    
    render(<Button data-testid={testId}>{defaultProps.children}</Button>);
    
    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('only accepts string children', () => {
    // This test verifies TypeScript constraint - should compile without error
    render(<Button>Simple string</Button>);
    expect(screen.getByText('Simple string')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(
      <Button 
        aria-describedby="button-description"
        aria-label="Custom accessibility label"
      >
        {defaultProps.children}
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom accessibility label');
    expect(button).toHaveAttribute('aria-describedby', 'button-description');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
    
    render(<Button onPress={handlePress}>{defaultProps.children}</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(handlePress).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(handlePress).toHaveBeenCalledTimes(2);
  });

  it('renders string content correctly', () => {
    render(<Button>Simple text content</Button>);
    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });
});
