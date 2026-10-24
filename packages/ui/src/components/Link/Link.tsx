import { localePath } from '@ermnvldmr/i18n';
import { castRef, cn, filterDataAttributes } from '@ermnvldmr/stl';
import React, { memo, useCallback, useRef, useState } from 'react';
import { useLink } from 'react-aria';

import { Text } from '../Text/Text';

import type { TextColor, TextSize, TextType } from '../Text/Text';
import type { ClassNameProps, DataAttributes } from '@ermnvldmr/stl';
import type { AriaLinkOptions } from 'react-aria';

/**
 * Props for the Link component.
 */
export interface LinkProps extends AriaLinkOptions, ClassNameProps, DataAttributes {
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
  /** Delay in milliseconds before the link appears after entering the viewport. */
  delay?: number;
  /** Whether to obfuscate the email/link from static HTML scrapers. */
  isObfuscated?: boolean;
}

/**
 * A generic navigation primitive for interactive text.
 *
 * Link ensures consistent styling and accessibility across all navigation elements.
 * It uses standard design system colors (--rb-ring) and provides responsive hover/focus states.
 */
export const Link = memo(function Link(props: LinkProps) {
  const {
    children,
    className,
    href,
    isExternal,
    type,
    size,
    color,
    delay,
    isObfuscated = false,
    ...otherProps
  } = props;

  const [isActivated, setIsActivated] = useState(false);
  const isMailto = Boolean(isObfuscated && href?.startsWith('mailto:'));
  const rawEmail = isMailto && href ? href.slice(7) : '';
  const atIndex = rawEmail.indexOf('@');
  const user = atIndex !== -1 ? rawEmail.slice(0, atIndex) : '';
  const domain = atIndex !== -1 ? rawEmail.slice(atIndex + 1) : '';

  const activate = useCallback(() => {
    setIsActivated(true);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      activate();
      if (!isActivated && href) {
        window.location.href = href;
        e.preventDefault();
      }
    },
    [activate, href, isActivated]
  );

  // We use a specific ref type that useLink expects.
  // Since Link can be an 'a' or a 'span', we use HTMLElement as common denominator.
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink(otherProps, ref);

  const sharedClasses = cn(
    !color && 'text-[var(--rb-ring)]',
    'cursor-pointer no-underline hover:underline underline-offset-4 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className
  );

  const dataAttributes = filterDataAttributes(props);

  if (href) {
    const isAutoExternal = isExternal ?? href.startsWith('http');
    const externalProps = isAutoExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    const resolvedHref = isMailto ? (isActivated ? href : '#') : localePath(href);

    const isChildrenEmail = typeof children === 'string' && children === rawEmail;
    const displayedContent =
      isMailto && !isActivated && isChildrenEmail ? (
        <span style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}>
          {domain.split('').reverse().join('')}@{user.split('').reverse().join('')}
        </span>
      ) : (
        children
      );

    const obfuscationAttrs = isMailto
      ? {
          'data-user': user,
          'data-domain': domain,
          'aria-label': rawEmail,
        }
      : {};

    return (
      <Text
        {...linkProps}
        {...externalProps}
        {...dataAttributes}
        {...obfuscationAttrs}
        ref={ref}
        as="a"
        className={sharedClasses}
        color={color}
        delay={delay}
        href={resolvedHref}
        size={size}
        type={type}
        onClick={isMailto ? handleClick : undefined}
        onFocus={isMailto ? activate : undefined}
        onPointerDown={isMailto ? activate : undefined}
        onPointerEnter={isMailto ? activate : undefined}
      >
        {displayedContent}
      </Text>
    );
  }

  return (
    <Text
      {...linkProps}
      {...dataAttributes}
      ref={castRef<HTMLSpanElement>(ref)}
      as="span"
      className={sharedClasses}
      color={color}
      delay={delay}
      size={size}
      type={type}
    >
      {children}
    </Text>
  );
});
