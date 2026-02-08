import { render, screen } from '@testing-library/react';
import React from 'react';

import { Table } from './Table';
import { TableContainer } from './testing/TableContainer/TableContainer';

describe('Table', () => {
  it('renders correctly with all sub-components', () => {
    render(
      <TableContainer>
        <Table>
          <Table.Caption>Caption</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.Head>Head</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Foot</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </TableContainer>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('Cell')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });

  it('applies density classes from context to cells', () => {
    render(
      <Table density="s">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Small</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    // 's' density is 'p-2'
    expect(screen.getByText('Small')).toHaveClass('p-2');
  });

  it('allows cell-level density overrides', () => {
    render(
      <Table density="s">
        <Table.Body>
          <Table.Row>
            <Table.Cell padding="l">Large</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    // Overridden to 'l' which is 'p-6'
    expect(screen.getByText('Large')).toHaveClass('p-6');
    expect(screen.getByText('Large')).not.toHaveClass('p-2');
  });

  it('allows row-level border overrides', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row noBorder>
            <Table.Cell data-testid="no-border-cell">No Border</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    // Now the cell handles the noBorder state
    expect(screen.getByTestId('no-border-cell')).not.toHaveClass('border-b');
  });

  it('renders Table.Content with correct layout', () => {
    render(
      <Table.Content data-testid="numeric-content" variant="numeric">
        123
      </Table.Content>
    );
    const content = screen.getByTestId('numeric-content');
    expect(content).toHaveClass('justify-end', 'tabular-nums');
  });

  it('TableContainer has accessibility attributes', () => {
    render(
      <TableContainer data-testid="container">
        <Table />
      </TableContainer>
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('tabindex', '0');
  });

  it('TableCell applies border classes', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell border="all" data-testid="bordered-cell">
              Bordered
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(screen.getByTestId('bordered-cell')).toHaveClass('border');
  });
});
