import React from 'react';

import { Stub } from './Stub';
import { render, screen } from '../../test-utils';

describe('components/Stub', () => {
  it('renders correctly with default props', () => {
    render(<Stub />);
    const stub = screen.getByTestId('stub');
    expect(stub).toBeInTheDocument();
    expect(stub).toHaveClass('animate-shimmer');
    expect(stub).toHaveClass('rounded-md');
  });

  it('applies custom dimensions via style', () => {
    render(<Stub height="100px" width="200px" />);
    const stub = screen.getByTestId('stub');
    expect(stub).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('applies correct rounded classes', () => {
    const { rerender } = render(<Stub rounded="full" />);
    expect(screen.getByTestId('stub')).toHaveClass('rounded-full');

    rerender(<Stub rounded="none" />);
    expect(screen.getByTestId('stub')).toHaveClass('rounded-none');

    rerender(<Stub rounded="lg" />);
    expect(screen.getByTestId('stub')).toHaveClass('rounded-lg');
  });

  it('disables animation when animate prop is false', () => {
    render(<Stub animate={false} />);
    const stub = screen.getByTestId('stub');
    expect(stub).not.toHaveClass('animate-shimmer');
  });

  it('applies custom className', () => {
    render(<Stub className="custom-class" />);
    const stub = screen.getByTestId('stub');
    expect(stub).toHaveClass('custom-class');
  });
});
