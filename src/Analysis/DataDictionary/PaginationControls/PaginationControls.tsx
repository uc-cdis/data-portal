import React, { useState } from 'react';
import { Text, Pagination, SimpleGrid } from '@mantine/core';
import EntriesQuanitySelector from './EntriesQuantitySelector';

const PaginationControls: React.FC = (): JSX.Element => {
  interface Data {
    id: number;
    name: string;
  }
  const sampleData: Data[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Mary' },
    { id: 3, name: 'Jane' },
  ];
  const [data, setData] = useState<Data[]>(sampleData);

  const [activePage, setActivePage] = useState(1);

  return (
    <div className='pagination-wrapper'>
      <SimpleGrid cols={2}>
        <EntriesQuanitySelector />
        <div className='pagination-container'>
          <Pagination
            align='right'
            totalItems={data.length}
            value={activePage}
            onChange={setActivePage}
            total={10}
          />
        </div>
      </SimpleGrid>
    </div>
  );
};
export default PaginationControls;
