import React from 'react';
import { Pagination, SimpleGrid } from '@mantine/core';

interface IPaginationControlsProps {
  entriesShown: number;
  handleTableChange: Function;
  currentPage: number;
  totalEntriesAvailable: number;
}

const PaginationControls = ({
  entriesShown,
  handleTableChange,
  currentPage,
  totalEntriesAvailable,
}: IPaginationControlsProps): JSX.Element => {
  const totalButtonsShown = Math.ceil(totalEntriesAvailable / entriesShown);
  return (
    <div className='pagination-wrapper' data-testid='pagination-controls'>
      <SimpleGrid cols={2}>
        <div className='entries-quantity-select'>
          <label htmlFor='entriesSelect'>Show</label>
          <select
            id='entriesSelect'
            data-testid='entries-select'
            name='entriesSelect'
            value={entriesShown}
            onChange={(e) => handleTableChange('entriesShown', Number(e.target.value))}
          >
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
          </select>
          <label htmlFor='entriesSelect'>entries</label>
        </div>

        <div className='pagination-container'>
          {`totalEntriesAvailable: ${totalEntriesAvailable}`}
          <br />
          {`entriesShown: ${entriesShown}`}
          <br />
          {`total: ${Math.ceil(totalEntriesAvailable / entriesShown)}`}
          <Pagination
            align='right'
            total={totalButtonsShown}
            value={currentPage}
            onChange={(e) => handleTableChange('currentPage', Number(e))}
          />
        </div>
      </SimpleGrid>
    </div>
  );
};
export default PaginationControls;
