import React from 'react';
import * as TestArticle from './articles/2026/test-article.mdx';

export interface Article {
  slug: string;
  title: string;
  description?: string;
  createdDate: Date;
  updatedDate?: Date;
  tags?: string[];
  image?: string;
  Component: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
}

function register(module: any, slug: string): Article {
  const { frontmatter, default: Component } = module;
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    createdDate: new Date(frontmatter.createdDate),
    updatedDate: frontmatter.updatedDate ? new Date(frontmatter.updatedDate) : undefined,
    tags: frontmatter.tags,
    image: frontmatter.image,
    Component,
  };
}

export const articles: Record<string, Article> = {
  'test-article': register(TestArticle, '2026/test-article'),
};

export const sortedArticles = Object.values(articles).sort(
  (a, b) => b.createdDate.getTime() - a.createdDate.getTime()
);
