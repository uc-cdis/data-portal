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
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} columnManagementData={DefaultAtlasColumnManagement}/>
      </table>,
    );
    expect(screen.getByTestId('column-headers')).toBeInTheDocument();
  });
  it('calls handleSort when a column is clicked', () => {
    const handleSort = jest.fn();
    render(
      <table>
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} columnManagementData={DefaultAtlasColumnManagement}/>
      </table>,
    );
    fireEvent.click(
      screen.getAllByRole('presentation', { name: 'caret-up' })[0],
    );
    expect(handleSort).toHaveBeenCalledTimes(1);
  });
});
