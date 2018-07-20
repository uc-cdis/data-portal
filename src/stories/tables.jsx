import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'regenerator-runtime/runtime';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';
import { Table } from '@arranger/components/dist/DataTable';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

const dummyConfig = {
  timestamp: '2018-01-12T16:42:07.495Z',
  type: 'subjects',
  keyField: 'case_id',
  defaultSorted: [{ id: 'case_id', desc: false }],
  columns: [
    {
      show: true,
      Header: 'Case.ID',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'case_id',
    },
    {
      show: true,
      Header: 'Project',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'project',
    },
    {
      show: true,
      Header: 'Study',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'study',
    },
    {
      show: true,
      Header: 'Gender',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'gender',
    },
    {
      show: true,
      Header: 'Vital Status',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'vital_status',
    },
    {
      show: true,
      Header: 'Ethnicity',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'ethnicity',
    },
    {
      show: true,
      Header: 'Race',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'race',
    },
    {
      show: true,
      Header: 'Birth Year',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'birth_year',
    },
    {
      show: true,
      Header: 'Death Year',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'death_year',
    },
    {
      show: true,
      Header: 'Species',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'species',
    },
    {
      show: true,
      Header: 'Number Visits',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'number_visits',
    },
    {
      show: true,
      Header: 'Lab Records',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'lab_records',
    },
    {
      show: true,
      Header: 'Drug Records',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'drug_records',
    },
    {
      show: true,
      Header: 'mRNA Array Records',
      type: 'integer',
      sortable: true,
      canChangeShow: true,
      accessor: 'mrna_records',
    },
  ],
};

const dummyData = Array(100)
  .fill()
  .map((_, i) => ({
    case_id: i,
    project: 'ndh-Charlie',
    study: 'MACS',
    gender: 'Male',
    vital_status: 'Alive',
    ethnicity: 'Hispanic or Latino',
    race: 'White',
    birth_year: 1941,
    death_year: null,
    species: 'None',
    number_visits: 26,
    lab_records: 26,
    drug_records: 26,
    mrna_records: 26,
  }));

const fetchDummyData = ({ sort, offset, first }) => Promise.resolve({
  total: dummyData.length,
  data: dummyData.sort((a, b) => {
    const x = a[sort.field];
    const y = b[sort.field];
    if (sort.order === 'asc') {
      return (x > y ? 1 : -1);
    }
    return (x > y ? -1 : 1);
  }).slice(offset, offset + first),
});

storiesOf('Tables', module)
  .add('Data Explorer Table', () => (
    <DataExplorerTable
      config={dummyConfig}
      fetchData={fetchDummyData}
    />
  ))
  .add('Arranger Table', () => (
    <Table
      config={dummyConfig}
      fetchData={fetchDummyData}
      setSelectedTableRows={action('selection changed')}
    />
  ));
