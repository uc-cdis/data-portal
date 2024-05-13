import React, { useEffect } from 'react';
import { Input } from '@mantine/core';
import { debounce } from 'lodash';
import SearchIcon from '../Icons/SearchIcon';
import { IRowData } from '../../Interfaces/Interfaces';
import SearchBarMessage from './SearchBarMessage/SearchBarMessage';
import filterTableData from './filterTableData';

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
  const debounceDelayInMilliseconds = 500;
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      filterTableData(TableData, searchTerm, setData);
    }, debounceDelayInMilliseconds);
    debouncedFilter();
  }, [searchTerm]);

  const handleInputChange = (event) => {
    handleTableChange('searchTerm', event.target.value);
  };

  const showSearchBarMessage = true;

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
            {showSearchBarMessage && (
              <div className='column'>
                <SearchBarMessage columnManagementReset={columnManagementReset} />
              </div>
            )}
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default SearchBar;
