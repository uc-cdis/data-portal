import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataDictionaryContainer from './DataDictionaryContainer';
import { ITableData } from './Interfaces/Interfaces';
import PreprocessTableData from './Utils/PreprocessTableData';
import TableData from './TestData/TableData'; // Replace with your test data mocks

const dataDictionaryUITestIds = [
  'data-dictionary-container',
  'search-bar',
  'column-headers',
  'entries-header',
  'pagination-controls',
];

describe('DataDictionaryContainer', () => {
  it('renders the DataDictionaryContainer component and associated UI elements correctly', () => {
    render(<DataDictionaryContainer />);
    dataDictionaryUITestIds.forEach((testID) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });
  });
  /*
  it('renders the SearchBar component and calls setData with updated searchInputValue', () => {
    const preprocessedTableData = PreprocessTableData(TableData);
    const updatedSearchInputValue = 'test';

    const { getByTestId } = render(<DataDictionaryContainer />);
    const searchBar = getByTestId('search-bar');

    fireEvent.change(searchBar, { target: { value: updatedSearchInputValue } });

    expect(searchBar).toHaveValue(updatedSearchInputValue); // Check if search bar value is updated
    expect(preprocessedTableData[0].Name).not.toEqual(updatedSearchInputValue); // Check if data isn't updated yet

    const handleSort = jest.fn(); // Mock the handleSort function

    render(
      <DataDictionaryContainer
        preprocessedTableData={preprocessedTableData}
        setData={() => {}}
        searchInputValue={''}
        setSearchInputValue={jest.fn()}
        columnsShown={11}
        sortConfig={{ sortKey: null, direction: 'off' }}
        setSortConfig={jest.fn()}
      >
        <SearchBar
          columnsShown={11}
          TableData={mockTableData as TableData}
          setData={handleSort as any} // Pass the mocked handleSort function to SearchBar
          searchInputValue={''}
          setSearchInputValue={jest.fn()}
        />
      </DataDictionaryContainer>
    );

    fireEvent.change(searchBar, { target: { value: updatedSearchInputValue } });

    expect(handleSort).toHaveBeenCalledWith('Name'); // Check if handleSort is called with the correct argument
  });

  it('calls setData with sorted data when sorting', () => {
    const preprocessedTableData = PreprocessTableData(mockTableData);
    const sortKey = 'Name';

    const { getByTestId } = render(<DataDictionaryContainer />);
    const handleSort = jest.fn();

    render(
      <DataDictionaryContainer
        preprocessedTableData={preprocessedTableData}
        setData={() => {}}
        searchInputValue={''}
        setSearchInputValue={jest.fn()}
        columnsShown={11}
        sortConfig={{ sortKey: null, direction: 'off' }}
        setSortConfig={handleSort as any} // Pass the mocked handleSort function to DataDictionaryContainer
      >
        <ColumnHeaders
          handleSort={handleSort}
          sortConfig={{ sortKey: null, direction: 'off' }}
        />
      </DataDictionaryContainer>
    );

    fireEvent.click(getByTestId('column-header-Name')); // Simulate a click on the Name header

    expect(handleSort).toHaveBeenCalledWith(sortKey); // Check if handleSort is called with the correct argument
  });*/
});
