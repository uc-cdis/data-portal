import React, { useEffect } from 'react';
import { Input } from '@mantine/core';
import { debounce } from 'lodash';
import SearchIcon from '../Icons/SearchIcon';
import { IRowData } from '../../Interfaces/Interfaces';
import SearchBarMessage from './SearchBarMessage/SearchBarMessage';

interface ISearchBarProps {
  columnsShown: number;
  TableData: IRowData[];
  setData: Function;
  searchTerm: string;
  handleTableChange: Function;
  columnManagementReset: Function
}

const SearchBar = ({
  columnsShown,
  TableData,
  setData,
  searchTerm,
  handleTableChange,
  columnManagementReset,
}: ISearchBarProps) => {
  const filterTableData = () => {
    const filteredData = TableData.filter((item) => {
      const searchQuery = searchTerm.toLowerCase().trim();
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
  };
  const debounceDelayInMilliseconds = 500;
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      filterTableData();
    }, debounceDelayInMilliseconds);
    debouncedFilter();
  }, [searchTerm]);

  const handleInputChange = (event) => {
    handleTableChange('searchTerm', event.target.value);
  };

  return (
    <thead className={'search-bar'} data-testid='search-bar'>
      <tr>
        <th aria-label='search bar' colSpan={columnsShown}>
          <div className='row'>
            <div className='search-bar-container'>
              <Input
                rightSection={
                  searchTerm ? (
                    <button
                      type='button'
                      className='search-bar-input-control column'
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
                value={searchTerm}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className='column'>
              <SearchBarMessage columnManagementReset={columnManagementReset} />
            </div>

          </div>
        </th>
      </tr>
    </thead>
  );
};

export default SearchBar;
