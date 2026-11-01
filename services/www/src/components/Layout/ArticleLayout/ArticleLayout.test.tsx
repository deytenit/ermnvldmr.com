import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { ArticleLayout } from './ArticleLayout';

describe('ArticleLayout', () => {
  const defaultProps = {
    title: 'Test Article Title',
    createdDate: new Date('2026-01-01T00:00:00Z'),
  };

  it('renders title, created date, and content', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('umami.disabled');

    render(
      <ArticleLayout {...defaultProps}>
        Article content body
      </ArticleLayout>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Test Article Title' })).toBeInTheDocument();
    expect(screen.getByText('Article content body')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      'https://static.ermnvldmr.com/www/privacy-policy.txt'
    );

    const telemetrySwitch = screen.getByRole('switch', { name: 'Toggle anonymous telemetry' });
    expect(telemetrySwitch).toBeChecked();

    await user.click(telemetrySwitch);
    expect(telemetrySwitch).not.toBeChecked();
    expect(window.localStorage.getItem('umami.disabled')).toBe('1');

    await user.click(telemetrySwitch);
    expect(telemetrySwitch).toBeChecked();
    expect(window.localStorage.getItem('umami.disabled')).toBeNull();
  });

  it('renders updated date when updatedDate prop is provided', () => {
    const updatedDate = new Date('2026-02-01T00:00:00Z');
    render(
      <ArticleLayout {...defaultProps} updatedDate={updatedDate}>
        Modified article content
      </ArticleLayout>
    );

    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  it('renders tags when provided', () => {
    render(
      <ArticleLayout {...defaultProps} tags={['react', 'typescript']}>
        Article content
      </ArticleLayout>
    );

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });
});
