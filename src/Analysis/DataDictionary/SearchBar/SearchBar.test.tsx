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
    const setSearchInputValue = jest.fn();

    render(
      <table>
        <SearchBar
          columnsShown={columnsShown}
          TableData={TableData}
          setData={setData}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
        />
      </table>,
    );

    // Simulate input change event
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Doe' } });

    expect(setSearchInputValue).toHaveBeenCalledTimes(1);
    expect(setSearchInputValue).toHaveBeenLastCalledWith('Doe');

    // Simulate key press event (Enter) to trigger search
    fireEvent.keyPress(input, { key: 'Enter' });

    expect(setData).toHaveBeenCalledTimes(1);
    const filteredData = TableData.filter((item) => Object.values(item).some((value) => value?.toString()?.toLowerCase()?.includes('do'),
    ),
    );
    expect(setData).toHaveBeenLastCalledWith(filteredData);
  });
});
