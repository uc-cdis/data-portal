import React, { useEffect } from 'react';
import { Input } from '@mantine/core';
import { debounce } from 'lodash';
import { IColumnManagementData, IRowData } from '../../Interfaces/Interfaces';
import SearchBarMessage from './SearchBarMessage/SearchBarMessage';
import filterTableData from './filterTableData';
import IconComponent from '../../../../../components/Icon';
import dictIcons from '../../../../../img/icons/index';

interface ISearchBarProps {
  columnsShown: number;
  TableData: IRowData[];
  paginatedData: IRowData[];
  setDisplayedData: Function;
  columnManagementData: IColumnManagementData ;
  searchTerm: string;
  handleTableChange: Function;
  columnManagementReset: Function
}

const SearchBar = ({
  columnsShown,
  TableData,
  paginatedData,
  setDisplayedData,
  columnManagementData,
  searchTerm,
  handleTableChange,
  columnManagementReset,
}: ISearchBarProps) => {
  const debounceDelayInMilliseconds = 500;
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      filterTableData(TableData, searchTerm, setDisplayedData);
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
              <div className='column'>
                <Input
                  rightSection={
                    searchTerm ? (
                      <button
                        type='button'
                        className='search-bar-input-control '
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
                      <IconComponent iconName='search' dictIcons={dictIcons} height='1em'/>
                    )
                  }
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            <div className='column'>
              <SearchBarMessage
                columnManagementReset={columnManagementReset}
                searchTerm={searchTerm}
                paginatedData={paginatedData}
                columnManagementData={columnManagementData}
              />
            </div>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default SearchBar;
