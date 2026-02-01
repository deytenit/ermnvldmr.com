import userEvent from '@testing-library/user-event';
import React from 'react';

import { Container } from './Container';
import { render, screen } from '../../test-utils';

describe('components/Container', () => {
  it('handles onPress event', async () => {
    const user = userEvent.setup();
    const handlePress = jest.fn();
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
});
