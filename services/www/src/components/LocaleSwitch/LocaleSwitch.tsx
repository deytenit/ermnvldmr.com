import { LOCALE, LOCALES, localeHref, type Locale } from '@ermnvldmr/i18n';
import React from 'react';

const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', ru: 'RU' };

export interface LocaleSwitchProps {
  /** Current page path (e.g. "/en/articles") — required for SSG rendering */
  currentPath?: string;
}

export const LocaleSwitch: React.FC<LocaleSwitchProps> = ({ currentPath }) => {
  const path =
    currentPath ??
    (typeof window !== 'undefined' ? window.location.pathname : `/${LOCALE}/`);

  return (
    <nav aria-label="Language switcher" className="flex gap-2">
      {LOCALES.map((locale) => {
        const href = localeHref(path, locale);
        const isCurrent = locale === LOCALE;
        return (
          <a
            key={locale}
            aria-current={isCurrent ? 'true' : undefined}
            className={isCurrent ? 'font-bold underline' : 'opacity-60 hover:opacity-100'}
            href={href}
          >
            {LOCALE_LABELS[locale]}
          </a>
        );
      })}
    </nav>
  );
};
