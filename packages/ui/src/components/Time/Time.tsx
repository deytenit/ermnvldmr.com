import { castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef, useMemo } from 'react';

import { Text } from '../Text/Text';

import type { TextProps } from '../Text/Text';

/**
 * Props for the Time component.
 */
export interface TimeProps extends Omit<TextProps, 'as' | 'children'> {
  /** The date to display */
  date: Date | string;
  /** Intl.DateTimeFormatOptions for formatting */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Locale for formatting (defaults to system/en-US) */
  locale?: string;
  /** Content to be rendered instead of formatted date */
  children?: React.ReactNode;
  /** Semantic ISO date string for the HTML time element */
  dateTime?: string;
}

/**
 * A semantic time component that wraps the Text component.
 *
 * Time provides a consistent way to display formatted dates while
 * maintaining semantic integrity using the HTML <time> element.
 */
export const Time = genericMemo(
  forwardRef<HTMLElement, TimeProps>(function Time(
    { date, formatOptions, locale = 'en-US', children, dateTime, ...props },
    ref
  ) {
    const dateObj = useMemo(() => (typeof date === 'string' ? new Date(date) : date), [date]);
    const isoString = useMemo(() => dateTime ?? dateObj.toISOString(), [dateTime, dateObj]);

    const formattedDate = useMemo(() => {
      if (children) return children;

      // If formatOptions contains dateStyle or timeStyle, we must not provide
      // individual components like year/month/day as it will throw an error.
      const hasStyle =
        formatOptions && ('dateStyle' in formatOptions || 'timeStyle' in formatOptions);
      const options: Intl.DateTimeFormatOptions = hasStyle
        ? { ...formatOptions }
        : {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...formatOptions,
          };

      return dateObj.toLocaleDateString(locale, options);
    }, [children, dateObj, locale, formatOptions]);

    return (
      <Text
        ref={castRef<HTMLElement>(ref)}
        as="time"
        dateTime={isoString}
        {...props}
      >
        {formattedDate}
      </Text>
    );
  })
);
