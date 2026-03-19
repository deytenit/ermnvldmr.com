import { PageHead as PageHeadOriginal, HStack, Link } from '@ermnvldmr/ui';
import React from 'react';

import { t } from './PageHead.i18n';

import type { PageHeadStrategy } from '@ermnvldmr/ui';

/**
 * Props for the WWW-specific PageHead.
 * Restricts customization to content-related fields.
 */
export interface PageHeadProps {
  /** The main heading text. */
  heading: string;
  /** The caption/description text. */
  caption?: React.ReactNode;
  /** Optional breadcrumbs. */
  breadcrumbs?: React.ReactNode;
  /** Optional metadata (like dates/tags) to show next to the logo. */
  metadata?: React.ReactNode;
  /** Header behavior strategy. */
  strategy?: PageHeadStrategy;
}

/**
 * The standard PageHead for the www service.
 * Enforces the "Vladimir Eremin" identity and site navigation.
 *
 * @param props - Component props.
 * @returns A PageHead component.
 * @example
 * ```tsx
 * <PageHead heading="My Page" />
 * ```
 */
export const PageHead = ({ heading, caption, breadcrumbs, metadata, strategy }: PageHeadProps) => {
  const nav = (
    <HStack gap={4}>
      <Link href="/articles">{t('Articles')}</Link>
      <Link href="https://github.com/deytenit">{t('GitHub')}</Link>
    </HStack>
  );

  return (
    <PageHeadOriginal
      addonLeft={metadata}
      addonRight={nav}
      breadcrumbs={breadcrumbs}
      caption={caption}
      heading={heading}
      strategy={strategy}
    />
  );
};
