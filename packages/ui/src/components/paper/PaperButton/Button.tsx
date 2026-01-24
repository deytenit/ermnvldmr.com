import React, { memo } from 'react';
import { useButton } from 'react-aria';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';
import type { AriaButtonProps } from 'react-aria';

/**
 * Props for the newspaper-style Button component.
 */
export interface ButtonProps extends AriaButtonProps, ClassNameProps, TestIdProps {
  /** The button text content */
  children: string;
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'secondary';
}

/**
 * A newspaper-style button component with italic Lato font and underlined text.
 * 
 * Features:
 * - Rectangular design with subtle background
 * - Italic Medium Lato font (500 weight)
 * - Underlined text decoration
 * - Accessible interaction patterns via react-aria
 * - Responsive hover and focus states
 * 
 * @example
 * ```tsx
 * <Button onPress={() => console.log('Clicked!')}>
 *   Explore all the articles
 * </Button>
 * ```
 */
export const Button = memo(function Button({ 
  children,
  variant = 'default',
  className = '',
  'data-testid': testId,
  ...buttonProps
}: ButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps: ariaButtonProps } = useButton(buttonProps, ref);

  const baseClasses = [
    // Layout and spacing
    'inline-flex items-center justify-center',
    'px-3 py-2',
    'min-h-[40px]',
    
    // Typography
    'font-sans font-medium italic',
    'text-base leading-6 tracking-[0.015em]',
    'text-center underline',
    
    // Appearance
    'border border-border',
    'rounded-none',
    'transition-all duration-200',
    
    // Interactive states
    'cursor-pointer',
    'hover:bg-muted/50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:bg-muted',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  const variantClasses = {
    default: [
      'bg-background text-foreground',
      'hover:bg-muted/30',
    ],
    primary: [
      'bg-primary text-primary-foreground',
      'hover:bg-primary/90',
    ],
    secondary: [
      'bg-secondary text-secondary-foreground', 
      'hover:bg-secondary/90',
    ],
  };

  const allClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    className,
  ].join(' ');

  return (
    <button
      {...ariaButtonProps}
      ref={ref}
      className={allClasses}
      data-testid={testId}
    >
      {children}
    </button>
  );
});


