import { cn } from '@ermnvldmr/stl';
import { VStack, HStack, Markdown, Container, Time, Header, Paragraph, Text } from '@ermnvldmr/ui';
import React from 'react';

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
 * It uses the project's base typography styles and provides a hero section
 * for metadata like title, date, and tags.
 *
 * @param props - The component props.
 * @param props.title
 * @param props.description
 * @param props.createdDate
 * @param props.updatedDate
 * @param props.tags
 * @param props.children
 * @param props.className
 * @returns A React element representing the article layout.
 * @example
 * ```tsx
 * <ArticleLayout
 *   title="Hello World"
 *   createdDate={new Date()}
 *   tags={['hello', 'world']}
 * >
 *   <p>This is my first article.</p>
 * </ArticleLayout>
 * ```
 */
export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  title,
  description,
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

  return (
    <Container as="article" className={cn('mx-auto max-w-3xl px-6 py-12 md:py-20', className)}>
      <VStack as="header" className="pb-12" gap={4}>
        <HStack align="center" className="flex-wrap" gap={4}>
          {displayDate}
          {tags && tags.length > 0 && (
            <HStack className="flex-wrap" gap={2}>
              {tags.map((tag) => (
                <Text
                  key={tag}
                  className="before:text-muted-foreground/50 before:mr-0.5 before:content-['#']"
                  color="muted"
                  size="s"
                >
                  {tag}
                </Text>
              ))}
            </HStack>
          )}
        </HStack>

        <Header className="leading-tight" level={1}>
          {title}
        </Header>

        {description && (
          <Paragraph italic className="leading-relaxed" color="muted" size="l">
            {description}
          </Paragraph>
        )}
      </VStack>

      <Container as="section" className="article-content">
        <Markdown>{children}</Markdown>
      </Container>
    </Container>
  );
};
