import { Button } from '@mantine/core';
import React from 'react';
import EyeIcon from '../../Icons/EyeIcon';
import InfoIcon from '../../Icons/InfoIcon';

const SearchBarMessage = ({ columnManagementReset }) => (
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

export default SearchBarMessage;
