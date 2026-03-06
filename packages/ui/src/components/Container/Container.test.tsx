import userEvent from '@testing-library/user-event';
import React from 'react';

import { Container } from './Container';
import { render, screen } from '../../lib/testing';

describe('components/Container', () => {
  it('handles onPress event', async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();
    render(<Container onPress={handlePress}>Content</Container>);

    const container = screen.getByText('Content');
    await user.click(container);
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('applies interactive styles when onPress is present', () => {
    const { rerender } = render(<Container>Content</Container>);
    let container = screen.getByText('Content');
    expect(container).not.toHaveClass('cursor-pointer');

    rerender(<Container onPress={() => {}}>Content</Container>);
    container = screen.getByText('Content');
    expect(container).toHaveClass('cursor-pointer');
    expect(container).toHaveClass('hover:brightness-95');
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

  it('renders as an anchor tag with href when href prop is provided', () => {
    render(<Container href="/test-path">Link Content</Container>);
    const linkElement = screen.getByText('Link Content');
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', '/test-path');
  });

  it('gives precedence to href over onPress', async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();
    render(
      <Container href="/test-path" onPress={handlePress}>
        Link Content
      </Container>
    );
    const linkElement = screen.getByText('Link Content');
    await user.click(linkElement);
    expect(handlePress).not.toHaveBeenCalled();
    expect(linkElement.tagName).toBe('A');
  });

  it('warns when both href and onPress are provided', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Container href="/test-path" onPress={() => {}}>
        Content
      </Container>
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[@ermnvldmr/ui] Container cannot have both `onPress` and `href` props.',
    );
    consoleWarnSpy.mockRestore();
  });
});
