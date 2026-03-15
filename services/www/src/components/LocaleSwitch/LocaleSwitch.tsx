import { LOCALE, OTHER_LOCALE, OTHER_LOCALE_LABEL, localeHref } from '@ermnvldmr/i18n';
import React from 'react';

/**
 * Renders a single link to the same page in the other locale.
 * The label is expressed in the current build's language:
 * EN build → "In Russian", RU build → "На Английском".
 *
 * @param props - Component props.
 * @returns An anchor element linking to the equivalent page in the other locale.
 */
export interface LocaleSwitchProps {
  /** Current page path (e.g. "/en/articles") — required for accurate SSG rendering */
  currentPath?: string;
}

export const LocaleSwitch: React.FC<LocaleSwitchProps> = ({ currentPath }) => {
  const path =
    currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : `/${LOCALE}/`);

  const href = localeHref(path, OTHER_LOCALE);

  return (
    <a aria-label={`Switch language to ${OTHER_LOCALE}`} href={href}>
      {OTHER_LOCALE_LABEL}
    </a>
  );
};
