import React from 'react';

import { Stack } from './Stack';
import { render, screen } from '../../lib/testing';

describe('components/Stack', () => {
  it('renders children correctly', () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('applies basic flex classes', () => {
    const { container } = render(<Stack>Content</Stack>);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('flex-row'); // Default
  });

  it('applies direction classes', () => {
    const { container, rerender } = render(<Stack direction="col">Content</Stack>);
    expect(container.firstChild).toHaveClass('flex-col');

    rerender(<Stack direction="row-reverse">Content</Stack>);
    expect(container.firstChild).toHaveClass('flex-row-reverse');
  });

  it('applies gap classes', () => {
    const { container } = render(<Stack gap={4}>Content</Stack>);
    expect(container.firstChild).toHaveClass('gap-4');
  });

  it('applies scrollable classes correctly', () => {
    const { container, rerender } = render(
      <Stack scrollable direction="row">
        Content
      </Stack>
    );
    // scrollable=true, direction=row -> overflow-x-auto
    expect(container.firstChild).toHaveClass('overflow-x-auto');
    expect(container.firstChild).not.toHaveClass('overflow-y-auto');

    rerender(
      <Stack scrollable direction="col">
        Content
      </Stack>
    );
    // scrollable=true, direction=col -> overflow-y-auto
    expect(container.firstChild).toHaveClass('overflow-y-auto');
    expect(container.firstChild).not.toHaveClass('overflow-x-auto');

    rerender(
      <Stack direction="row" scrollable={false}>
        Content
      </Stack>
    );
    expect(container.firstChild).not.toHaveClass('overflow-x-auto');
    expect(container.firstChild).not.toHaveClass('overflow-y-auto');
  });
});
