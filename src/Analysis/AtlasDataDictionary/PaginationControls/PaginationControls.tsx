import React from 'react';
import { Pagination, SimpleGrid } from '@mantine/core';

interface IPaginationControlsProps {
  entriesShown: number;
  setEntriesShown: Function;
  activePage: number;
  setActivePage: Function;
  totalEntriesAvailable: number;
}

const PaginationControls = ({
  entriesShown,
  setEntriesShown,
  activePage,
  setActivePage,
  totalEntriesAvailable,
}: IPaginationControlsProps): JSX.Element => (
  <div className='pagination-wrapper' data-testid='pagination-controls'>
    <SimpleGrid cols={2}>
      <div className='entries-quantity-select'>
        <label htmlFor='entriesSelect'>Show</label>
        <select
          id='entriesSelect'
          data-testid='entries-select'
          name='entriesSelect'
          value={entriesShown}
          onChange={(e) => setEntriesShown(Number(e.target.value))}
        >
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='30'>30</option>
        </select>
        <label htmlFor='entriesSelect'>entries</label>
      </div>

      <div className='pagination-container'>
        <Pagination
          align='right'
          total={totalEntriesAvailable / entriesShown}
          value={activePage}
          onChange={(e) => setActivePage(Number(e))}
        />
      </div>
    </SimpleGrid>
  </div>
);
export default PaginationControls;
