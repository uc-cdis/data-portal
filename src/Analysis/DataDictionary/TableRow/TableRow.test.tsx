
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableRow from './TableRow';
import TableData from '../TestData/TableData';
import { IRowData } from '../Interfaces/Interfaces';

describe('TableRow test', () => {
  const initialSearchInputValue = 'searchTerm';
  const rowData: IRowData = TableData.data[0];


  it('renders the tableRow component and associated UI elements correctly', () => {
    render(<TableRow />);
    const testIDs = ['expand-icon']

    testIDs.forEach((testID:string) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });

  it('handles click event on expandable row', () => {
    const { getByTestId, queryByTestId } = render(
      <TableRow
        rowObject={rowData}
        columnsShown={10}
        searchInputValue={initialSearchInputValue}
      />
    );

    fireEvent.click(getByTestId('expandable-td'));

    expect(queryByTestId('grid')).toBeInTheDocument(); // Adjust the test id based on your component implementation
  });
});
