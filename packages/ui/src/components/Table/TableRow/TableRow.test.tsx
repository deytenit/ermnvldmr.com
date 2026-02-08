import { render, screen } from '@testing-library/react';
import React from 'react';

import { Table } from '../Table';
import { TableRow } from './TableRow';

describe('TableRow', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Row').closest('tr')).toBeInTheDocument();
  });

  it('applies selected class', () => {
    render(
      <Table>
        <tbody>
          <TableRow selected data-testid="row">
            <td>Selected</td>
          </TableRow>
        </tbody>
      </Table>
    );
    expect(screen.getByTestId('row')).toHaveClass('bg-[var(--rb-muted-base)]');
  });
});
