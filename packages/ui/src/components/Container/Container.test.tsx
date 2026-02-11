import userEvent from '@testing-library/user-event';
import React from 'react';

import { Container } from './Container';
import { render, screen } from '../../test-utils';

describe('components/Container', () => {
  it('handles onPress event', async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();
    render(<Container onPress={handlePress}>Content</Container>);

    const container = screen.getByText('Content');
    await user.click(container);
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('applies cursor-pointer and active styles when onPress is present', () => {
    const { rerender } = render(<Container>Content</Container>);
    let container = screen.getByText('Content');
    expect(container).not.toHaveClass('cursor-pointer');

    rerender(<Container onPress={() => {}}>Content</Container>);
    container = screen.getByText('Content');
    expect(container).toHaveClass('cursor-pointer');
    expect(container).toHaveClass('active:opacity-80');
  });

  it('renders as different HTML elements using the "as" prop', () => {
    const { rerender } = render(<Container as="main">Main Content</Container>);
    expect(screen.getByText('Main Content').tagName).toBe('MAIN');

    rerender(<Container as="article">Article Content</Container>);
    expect(screen.getByText('Article Content').tagName).toBe('ARTICLE');

    rerender(<Container as="section">Section Content</Container>);
    expect(screen.getByText('Section Content').tagName).toBe('SECTION');
  });
});
