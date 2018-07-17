import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'regenerator-runtime/runtime';
import { Table } from '@arranger/components/dist/DataTable';

const dummyConfig = {
  timestamp: '2018-01-12T16:42:07.495Z',
  type: 'files',
  keyField: 'file_id',
  defaultSorted: [{ id: 'access', desc: false }],
  columns: [
    {
      show: true,
      Header: 'Access',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'access',
    },
    {
      show: true,
      Header: 'File Id',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_id',
    },
    {
      show: true,
      Header: 'File Name',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_name',
    },
    {
      show: true,
      Header: 'Data Type',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'data_type',
    },
    {
      show: true,
      Header: 'File Size',
      type: 'bits',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_size',
    },
  ],
};

var count = 0;

const dummyData = Array(100)
  .fill()
  .map(() => {
    const cases = Array(Math.floor(Math.random() * 10))
      .fill()
      .map(() => ({
        node: {
          primary_site: count,
        },
      }));
    return {
      access: Math.random() > 0.5 ? 'controlled' : 'open',
      file_id: count,
      file_name: count,
      data_type: count,
      file_size: Math.floor(Math.random() * 10000000),
      cases: {
        hits: {
          total: cases.length,
          edges: cases,
        },
      },
    };
    count += 1;
  });

const fetchDummyData = ({ config, sort, offset, first }) => {
  return Promise.resolve({
    total: dummyData.length,
    data: dummyData,
  });
};

storiesOf('Tables', module)
  .add('Arranger Table', () => (
    <Table
      config={dummyConfig}
      fetchData={fetchDummyData}
      setSelectedTableRows={action('selection changed')}
    />
  ));
