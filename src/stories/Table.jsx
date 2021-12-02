import React, { useCallback, useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../GuppyDataExplorer/ExplorerTable/Table';

const rawData = [
  { foo: 0, bar: 't', baz: 'yes' },
  { foo: 1, bar: 's', baz: 'no' },
  { foo: 2, bar: 'r', baz: 'yes' },
  { foo: 3, bar: 'q', baz: 'no' },
  { foo: 4, bar: 'p', baz: 'yes' },
  { foo: 5, bar: 'o', baz: 'no' },
  { foo: 6, bar: 'n', baz: 'yes' },
  { foo: 7, bar: 'm', baz: 'no' },
  { foo: 8, bar: 'l', baz: 'yes' },
  { foo: 9, bar: 'k', baz: 'no' },
  { foo: 10, bar: 'j', baz: 'yes' },
  { foo: 11, bar: 'i', baz: 'no' },
  { foo: 12, bar: 'h', baz: 'yes' },
  { foo: 13, bar: 'g', baz: 'no' },
  { foo: 14, bar: 'f', baz: 'yes' },
  { foo: 15, bar: 'e', baz: 'no' },
  { foo: 16, bar: 'd', baz: 'yes' },
  { foo: 17, bar: 'c', baz: 'no' },
  { foo: 18, bar: 'b', baz: 'yes' },
  { foo: 19, bar: 'a', baz: 'no' },
];

const columns = [
  {
    Header: 'Foo',
    accessor: 'foo',
    width: 150,
  },
  {
    Header: 'Bar',
    accessor: 'bar',
    width: 250,
  },
  {
    Header: 'Baz',
    accessor: 'baz',
    width: 300,
  },
];

storiesOf('Table', module)
  .add('Default', () => {
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
      const newData = rawData.slice();
      if (sortBy.length > 0)
        newData.sort((a, b) => {
          const { id, desc } = sortBy[0];
          if (a[id] > b[id]) return desc ? -1 : 1;
          if (a[id] < b[id]) return desc ? 1 : -1;
          return 0;
        });

      const start = pageIndex * pageSize;
      const end = start + pageSize;
      setData(newData.slice(start, end));
      setPageCount(Math.ceil(newData.length / pageSize));
    }, []);

    return (
      <Table
        columns={columns}
        data={data}
        onFetchData={handleFetchData}
        pageCount={pageCount}
      />
    );
  })
  .add('No data', () => {
    const data = useMemo(() => [], []);
    return (
      <Table
        columns={columns}
        data={data}
        onFetchData={() => {}}
        NoDataComponent={() => <div className='rt-noData'>No data</div>}
        showPageSizeOptions={false}
      />
    );
  })
  .add('No pagination', () => {
    const [data, setData] = useState([]);
    const handleFetchData = useCallback(({ sortBy }) => {
      const newData = rawData.slice();
      if (sortBy.length > 0)
        newData.sort((a, b) => {
          const { id, desc } = sortBy[0];
          if (a[id] > b[id]) return desc ? -1 : 1;
          if (a[id] < b[id]) return desc ? 1 : -1;
          return 0;
        });

      setData(newData);
    }, []);

    return (
      <Table
        columns={columns}
        data={data}
        defaultPageSize={rawData.length}
        onFetchData={handleFetchData}
        showPagination={false}
      />
    );
  });
