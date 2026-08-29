import { Button } from '@mantine/core';
import React from 'react';
import IconComponent from '../../../../../../components/Icon';
import dictIcons from '../../../../../../img/icons/index';
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
        <span><IconComponent iconName='info' dictIcons={dictIcons} height='1em' /></span>
            Matches found in hidden columns.
        <Button
          leftIcon={<IconComponent iconName='gwas-eyeIcon' dictIcons={dictIcons} height='1em' />}
          data-testid='show-all-button'
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
