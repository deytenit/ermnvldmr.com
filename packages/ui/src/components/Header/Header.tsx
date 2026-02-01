import React, { memo } from 'react';

import { Text } from '../Text/Text';

import type { TextProps, TextType, TextSize } from '../Text/Text';

/**
 * Props for the Header component.
 */
export interface HeaderProps extends Omit<TextProps, 'as'> {
  /** The semantic header level (1-6) */
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * A semantic header component that wraps the Text component.
 *
 * Header automatically maps semantic levels (h1-h6) to the appropriate
 * typography variants in the design system, ensuring accessibility
 * and visual consistency.
 */
export const Header = memo(function Header({ level, type, size, children, ...props }: HeaderProps) {
  // Default mappings from level to type and size
  const levelMapping: Record<number, { type: TextType; size: TextSize }> = {
    1: { type: 'display', size: 'l' },
    2: { type: 'display', size: 'm' },
    3: { type: 'headline', size: 'l' },
    4: { type: 'headline', size: 'm' },
    5: { type: 'title', size: 'l' },
    6: { type: 'title', size: 'm' },
  };

  const defaultStyles = levelMapping[level];
  const tags = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const;
  const Tag = tags[level];

  return (
    <Text as={Tag} size={size ?? defaultStyles.size} type={type ?? defaultStyles.type} {...props}>
      {children}
    </Text>
  );
});
