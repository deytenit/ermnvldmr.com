import userEvent from '@testing-library/user-event';
import React from 'react';

import { PaperButton } from './PaperButton';
import { render, screen } from '../../../test-utils';

/**
 * Test suite for the newspaper-style PaperButton component
 */
describe('components/paper/PaperButton/PaperButton', () => {
  const defaultProps = {
    children: 'Test PaperButton',
  };

  it('renders correctly with default props', () => {
    render(<PaperButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Test PaperButton' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test PaperButton');
  });

  it('applies correct styling classes', () => {
    render(<PaperButton {...defaultProps} />);
    
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
    
    render(<PaperButton onPress={handlePress}>{defaultProps.children}</PaperButton>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <PaperButton variant="primary">{defaultProps.children}</PaperButton>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    
    rerender(<PaperButton variant="secondary">{defaultProps.children}</PaperButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('handles disabled state correctly', () => {
    render(<PaperButton isDisabled>{defaultProps.children}</PaperButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('does not trigger onPress when disabled', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
    
    render(
      <PaperButton isDisabled onPress={handlePress}>
        {defaultProps.children}
      </PaperButton>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('supports custom className prop', () => {
    const customClass = 'custom-button-class';
    
    render(<PaperButton className={customClass}>{defaultProps.children}</PaperButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('supports data-testid prop', () => {
    const testId = 'my-test-button';
    
    render(<PaperButton data-testid={testId}>{defaultProps.children}</PaperButton>);
    
    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test PaperButton');
  });

  it('only accepts string children', () => {
    // This test verifies TypeScript constraint - should compile without error
    render(<PaperButton>Simple string</PaperButton>);
    expect(screen.getByText('Simple string')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(
      <PaperButton 
        aria-describedby="button-description"
        aria-label="Custom accessibility label"
      >
        {defaultProps.children}
      </PaperButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom accessibility label');
    expect(button).toHaveAttribute('aria-describedby', 'button-description');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
    
    render(<PaperButton onPress={handlePress}>{defaultProps.children}</PaperButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(handlePress).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(handlePress).toHaveBeenCalledTimes(2);
  });

  it('renders string content correctly', () => {
    render(<PaperButton>Simple text content</PaperButton>);
    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });
});
