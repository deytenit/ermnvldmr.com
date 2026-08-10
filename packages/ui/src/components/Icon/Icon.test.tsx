import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';

const DummySvg = ({ className }: { className?: string }) => (
  <svg className={className} data-testid="dummy-svg" />
);

describe('components/Icon', () => {
  it('renders icon component with inline-icon class', () => {
    render(<Icon icon={DummySvg} />);
    const el = screen.getByTestId('dummy-svg');
    expect(el).toHaveClass('inline-icon');
  });

  it('merges custom className', () => {
    render(<Icon className="text-primary-text" icon={DummySvg} />);
    const el = screen.getByTestId('dummy-svg');
    expect(el).toHaveClass('inline-icon');
    expect(el).toHaveClass('text-primary-text');
  });
});
