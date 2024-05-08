import { Button } from '@mantine/core';
import React, { useEffect } from 'react';
import EyeIcon from '../../Icons/EyeIcon';
import InfoIcon from '../../Icons/InfoIcon';

const SearchBarMessage = ({ columnManagementReset }) => {
  console.log('hello world');
  return (
    <div className='search-bar-message'>
      <span><InfoIcon /></span>
            Matches found in hidden columns.
      <Button
        leftIcon={<EyeIcon />}
        variant='outlined'

        onClick={() => columnManagementReset()}
      >Show all
      </Button>
    </div>
  );
};

export default SearchBarMessage;
