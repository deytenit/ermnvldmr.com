import React from 'react';
import * as TestArticle from './articles/2026/test-article.en.mdx';
import * as MatrixServerDeploymentGuide from './articles/2026/matrix-server-deployment-guide.en.mdx';
import * as XrayCoreSubnetMimicry from './articles/2026/xray-core-subnet-mimicry.en.mdx';
import * as JoplinWebDeploymentGuide from './articles/2026/joplin-web-deployment-guide.en.mdx';

export interface Article {
  slug: string;
  title: string;
  description?: string;
  createdDate: Date;
  updatedDate?: Date;
  tags?: string[];
  image?: string;
  Component: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
}

interface MdxModule {
  frontmatter: {
    title: string;
    description?: string;
    createdDate: string;
    updatedDate?: string;
    tags?: string[];
    image?: string;
  };
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
}

function register(module: unknown, slug: string): Article {
  const { frontmatter, default: Component } = module as MdxModule;
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
  'matrix-server-deployment-guide': register(
    MatrixServerDeploymentGuide,
    '2026/matrix-server-deployment-guide'
  ),
  'xray-core-subnet-mimicry': register(XrayCoreSubnetMimicry, '2026/xray-core-subnet-mimicry'),
  'joplin-web-deployment-guide': register(
    JoplinWebDeploymentGuide,
    '2026/joplin-web-deployment-guide'
  ),
};

export const sortedArticles = Object.values(articles).sort(
  (a, b) => b.createdDate.getTime() - a.createdDate.getTime()
);
