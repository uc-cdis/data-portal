import React, { useEffect } from 'react';
import { Input } from '@mantine/core';
import SearchIcon from '../Icons/SearchIcon';
import { IRowData } from '../../Interfaces/Interfaces';

interface ISearchBarProps {
  columnsShown: number;
  TableData: IRowData[];
  setData: Function;
  searchInputValue: string;
  handleTableChange: Function;
}

const SearchBar = ({
  columnsShown,
  TableData,
  setData,
  searchInputValue,
  handleTableChange,
  // setSearchInputValue,
}: ISearchBarProps) => {
  useEffect(() => {
    const filteredData = TableData.filter((item) => {
      const searchQuery = searchInputValue.toLowerCase().trim();
      return Object.values(item).some((value) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return value.toString().toLowerCase().includes(searchQuery);
        }
        if (Array.isArray(value)) {
          let doesArrayContainsSearchQuery = false;
          value.forEach((arrItem) => {
            Object.values(arrItem).some((arrObjValue) => {
              if (
                (typeof arrObjValue === 'string'
                  || typeof arrObjValue === 'number')
                && arrObjValue.toString().toLowerCase().includes(searchQuery)
              ) {
                doesArrayContainsSearchQuery = true;
              }
              return null;
            });
          });
          return doesArrayContainsSearchQuery;
        }
        return null;
      });
    });
    setData(filteredData);
  }, [searchInputValue]);

  const handleInputChange = (event) => {
    // setSearchInputValue(event.target.value);
    handleTableChange('searchTerm', event.target.value);
  };

  return (
    <thead className={'search-bar'} data-testid='search-bar'>
      <tr>
        <th colSpan={columnsShown}>
          <div className='search-bar-container'>
            <Input
              rightSection={
                searchInputValue ? (
                  <button
                    type='button'
                    className='search-bar-input-control'
                    onClick={() => handleTableChange('searchTerm', '')}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        handleTableChange('searchTerm', '');
                      }
                    }}
                  >
                    x
                  </button>
                ) : (
                  <SearchIcon />
                )
              }
              placeholder='Search'
              value={searchInputValue}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default SearchBar;
