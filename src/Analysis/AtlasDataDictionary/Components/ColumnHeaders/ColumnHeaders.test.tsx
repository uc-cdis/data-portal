import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ISortConfig } from '../../Interfaces/Interfaces';
import '@testing-library/jest-dom/extend-expect';
import ColumnHeaders from './ColumnHeaders';
import DefaultAtlasColumnManagement from '../../Utils/DefaultAtlasColumnManagement';

const sortConfig: ISortConfig = { sortKey: '', direction: 'ascending' };
describe('ColumnHeaders', () => {
  it('renders ColumnHeaders ', () => {
    const handleSort = jest.fn();

    render(
      <table>
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} columnManagementData={DefaultAtlasColumnManagement} />
      </table>,
    );
    expect(screen.getByTestId('column-headers')).toBeInTheDocument();
  });
  it('calls handleSort when a column is clicked', () => {
    const handleSort = jest.fn();
    render(
      <table>
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} columnManagementData={DefaultAtlasColumnManagement} />
      </table>,
    );
    fireEvent.click(
      screen.getAllByRole('presentation', { name: 'caret-up' })[0],
    );
    expect(handleSort).toHaveBeenCalledTimes(1);
  });
  it('Renders column headers based on columnManagementData', () => {
    const handleSort = jest.fn();
    const columnManagementDataMock = {
      vocabularyID: true,
      conceptID: false,
      valueSummary: true,
      // Add more mock data as needed
    };

    render(
      <table>
        <ColumnHeaders
          handleSort={handleSort}
          sortConfig={sortConfig}
          columnManagementData={columnManagementDataMock}
        />
      </table>,
    );

    expect(screen.getByTestId('column-headers')).toBeInTheDocument();

    // Check for headers that should be visible
    expect(screen.queryByText(/Vocabulary/)).toBeInTheDocument();
    expect(screen.queryByText(/Value/)).toBeInTheDocument();
        // Check for headers that should not be visible
    expect(screen.queryByText(/Concept/)).not.toBeInTheDocument();
  });
});
