import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('should update data based on input value', () => {
    const columnsShown = 5;
    const TableData: any = [
      { id: 1, name: 'John Doe', age: 28 },
      { id: 2, name: 'Jane Doe', age: 30 },
      { id: 3, name: 'Bob Smith', ages: [25, 31] },
    ];
    const setData = jest.fn();
    const searchInputValue = 'Do';
    const handleTableChange = jest.fn();

    render(
      <table>
        <SearchBar
          columnsShown={columnsShown}
          TableData={TableData}
          setData={setData}
          searchTerm={searchInputValue}
          handleTableChange={handleTableChange}
        />
      </table>,
    );

    // Simulate input change event
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Doe' } });

    // Simulate key press event (Enter) to trigger search
    fireEvent.keyPress(input, { key: 'Enter' });

    // Expect set data to be filtered by search term
    expect(setData).toHaveBeenCalledTimes(1);
    const filteredData = TableData.filter((item) => Object.values(item).some((value) => {
      const valueToString = value?.toString()?.toLowerCase();
      return valueToString && valueToString.includes('doe');
    }));
    expect(setData).toHaveBeenLastCalledWith(filteredData);
    // Expect handleTableChange to be called to update search term
    expect(handleTableChange).toHaveBeenLastCalledWith('searchTerm', 'Doe');
  });
});
