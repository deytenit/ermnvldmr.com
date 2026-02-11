import { castRef, cn } from '@ermnvldmr/stl';
import React, { memo, useRef } from 'react';
import { useLink } from 'react-aria';

import { Text } from '../Text/Text';

import type { ClassNameProps } from '@ermnvldmr/stl';
import type { AriaLinkOptions } from 'react-aria';
import type { TextColor, TextSize, TextType } from '../Text/Text';

/**
 * Props for the Link component.
 */
export interface LinkProps extends AriaLinkOptions, ClassNameProps {
  /** The destination URL. Renders as an <a> tag if provided. */
  href?: string;
  /** Link content */
  children: React.ReactNode;
  /** Whether the link is external (opens in new tab) */
  isExternal?: boolean;
  /** Typography style type */
  type?: TextType;
  /** Typography size variant */
  size?: TextSize;
  /** Text color variant */
  color?: TextColor;
}

/**
 * A generic navigation primitive for interactive text.
 *
 * Link ensures consistent styling and accessibility across all navigation elements.
 * It uses standard design system colors (--rb-ring) and provides responsive hover/focus states.
 */
export const Link = memo(function Link(props: LinkProps) {
  const { children, className, href, isExternal, type, size, color, ...otherProps } = props;

  // We use a specific ref type that useLink expects.
  // Since Link can be an 'a' or a 'span', we use HTMLElement as common denominator.
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink(otherProps, ref);

  const sharedClasses = cn(
    !color && 'text-[var(--rb-ring)]',
    'cursor-pointer hover:underline underline-offset-4 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className
  );

  if (href) {
    const isAutoExternal = isExternal ?? href.startsWith('http');
    const externalProps = isAutoExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <Text
        {...linkProps}
        {...externalProps}
        ref={ref}
        as="a"
        className={sharedClasses}
        color={color}
        href={href}
        size={size}
        type={type}
      >
        {children}
      </Text>
    );
  }

  return (
    <Text
      {...linkProps}
      ref={castRef<HTMLSpanElement>(ref)}
      as="span"
      className={sharedClasses}
      color={color}
      size={size}
      type={type}
    >
      {children}
    </Text>
  );
});
