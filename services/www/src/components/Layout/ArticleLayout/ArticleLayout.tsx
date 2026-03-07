import { Markdown, Time, Text, PageColumns, PageColumn, Breadcrumbs, HStack } from '@ermnvldmr/ui';
import React from 'react';

import { DefaultLayout } from '../DefaultLayout/DefaultLayout';

/**
 * Props for the ArticleLayout component.
 */
export interface ArticleLayoutProps {
  /** The title of the article. */
  title: string;
  /** A short description or lead paragraph for the article. */
  description?: string;
  /** The date the article was created. */
  createdDate: Date;
  /** The date the article was last updated. */
  updatedDate?: Date;
  /** An array of tags associated with the article. */
  tags?: string[];
  /** The content of the article. */
  children: React.ReactNode;
  /** Optional additional class names for the article container. */
  className?: string;
}

/**
 * ArticleLayout provides a structured container for long-form content.
 * It uses DefaultLayout and PageColumns to provide a clean reading experience.
 *
 * @param props - Component props.
 * @returns A React element representing the article layout.
 * @example
 * ```tsx
 * <ArticleLayout title="My Article" createdDate={new Date()}>
 *   Content
 * </ArticleLayout>
 * ```
 */
export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  title,
  createdDate,
  updatedDate,
  tags,
  children,
  className,
}) => {
  const displayDate = updatedDate ? (
    <Text color="muted" size="s" type="label">
      Updated <Time date={updatedDate} />
    </Text>
  ) : (
    <Time color="muted" date={createdDate} size="s" type="label" />
  );

  const metadata = (
    <HStack align="center" gap={2} wrap="wrap">
      {displayDate}
      {tags && tags.length > 0 && (
        <HStack gap={1} wrap="wrap">
          {tags.map((tag) => (
            <Text key={tag} className="before:content-['#']" color="muted" size="s">
              {tag}
            </Text>
          ))}
        </HStack>
      )}
    </HStack>
  );

  const breadcrumbs = (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item href="/articles">Articles</Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item isCurrent>{title}</Breadcrumbs.Item>
    </Breadcrumbs>
  );

  return (
    <DefaultLayout
      breadcrumbs={breadcrumbs}
      description={metadata}
      paddingY="medium"
      title={title}
      width="slim"
    >
      <PageColumns className={className} gap={12}>
        <PageColumn size="full">
          <section className="w-full">
            <Markdown>{children}</Markdown>
          </section>
        </PageColumn>
      </PageColumns>
    </DefaultLayout>
  );
};
