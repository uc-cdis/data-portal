import { Button } from '@mantine/core';
import React from 'react';
import EyeIcon from '../../Icons/EyeIcon';
import InfoIcon from '../../Icons/InfoIcon';
import showSearchBarMessage from './showSearchBarMessage';
import { IColumnManagementData, IRowData } from '../../../Interfaces/Interfaces';

interface ISearchBarMessageProps {
  columnManagementReset: Function;
  searchTerm: string;
  paginatedData: IRowData[];
  columnManagementData: IColumnManagementData ;
}

const SearchBarMessage = ({
  columnManagementReset, searchTerm, paginatedData, columnManagementData,
}: ISearchBarMessageProps) => {
  if (showSearchBarMessage(searchTerm, paginatedData, columnManagementData)) {
    return (
      <div className='search-bar-message'>
        <span><InfoIcon /></span>
            Matches found in hidden columns.
        <Button
          leftIcon={<EyeIcon />}
          variant='outline'
          onClick={() => columnManagementReset()}
        >Show all
        </Button>
      </div>
    );
  }
  return null;
};

export default SearchBarMessage;
