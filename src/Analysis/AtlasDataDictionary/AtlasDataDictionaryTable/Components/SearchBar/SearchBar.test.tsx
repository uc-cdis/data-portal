import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import SearchBar from './SearchBar';
import DefaultAtlasColumnManagement from '../../Utils/DefaultAtlasColumnManagement';

describe('SearchBar', () => {
  it('should update data based on input value', async () => {
    const columnsShown = 5;
    const TableData: any = [
      { id: 1, name: 'John Doe', age: 28 },
      { id: 2, name: 'Jane Doe', age: 30 },
      { id: 3, name: 'Bob Smith', ages: [25, 31] },
    ];
    const setDisplayedData = jest.fn();
    const searchInputValue = 'Do';
    const handleTableChange = jest.fn();
    const columnManagementReset = jest.fn();

    render(
      <table>
        <SearchBar
          columnsShown={columnsShown}
          TableData={TableData}
          paginatedData={TableData}
          setDisplayedData={setDisplayedData}
          searchTerm={searchInputValue}
          handleTableChange={handleTableChange}
          columnManagementReset={columnManagementReset}
          columnManagementData={DefaultAtlasColumnManagement}
        />
      </table>,
    );

    // Simulate input change event
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Doe' } });

    // Simulate key press event (Enter) to trigger search
    fireEvent.keyPress(input, { key: 'Enter' });

    // Expect set data to be filtered by search term after debouncing
    await waitFor(() => expect(setDisplayedData).toHaveBeenCalledTimes(1));

    const filteredData = TableData.filter((item) => Object.values(item).some((value) => {
      const valueToString = value?.toString()?.toLowerCase();
      return valueToString && valueToString.includes('doe');
    }));
    expect(setDisplayedData).toHaveBeenLastCalledWith(filteredData);
    // Expect handleTableChange to be called to update search term
    expect(handleTableChange).toHaveBeenLastCalledWith('searchTerm', 'Doe');
  });
});
