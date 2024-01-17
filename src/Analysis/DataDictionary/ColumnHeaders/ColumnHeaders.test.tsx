import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ColumnHeaders from './ColumnHeaders';
import Header from './Header'; // Assuming you've exported the Header component for testing

interface ISortConfig {
  sortKey: string;
  sortDirection: 'asc' | 'desc';
}

describe('ColumnHeaders', () => {
  it('renders ColumnHeaders ', () => {
    const handleSort = jest.fn();
    const sortConfig: ISortConfig = {};

    render(
      <table>
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />
      </table>
    );

    expect(screen.getByTestId('column-headers')).toBeInTheDocument();
  });
  it('calls handleSort when a column is clicked', () => {
    const handleSort = jest.fn();
    const sortConfig: ISortConfig = {};

    const { getByRole } = render(
      <table>
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />
      </table>
    );

    fireEvent.click(
      screen.getAllByRole('presentation', { name: 'caret-up' })[0]
    );

    expect(handleSort).toHaveBeenCalledWith('vocabularyID'); // or 'desc' depending on the initial sorting state
  });
});
