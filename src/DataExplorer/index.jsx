import React from 'react';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';

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
      accessor: 'name',
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
    /*
    {
      show: true,
      Header: 'Vital Status',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'vital_status',
    },
    */
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
    } /*,
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
    },*/
  ],
};

const fetchGQL = ({ sort, offset, first }) => {
  return fetch(
    '/api/v0/flat-search/search/graphql',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(
        {
          query: "{ subject { hits { edges { node { name, project, study, gender, ethnicity, race, file_type }}}}}",
        }
      )
    }
  ).then(
    res => res.json()
  ).then(
    (data) => {
      console.log('Got data:', data);
      const clean = data.data.subject.hits.edges.map( it => it.node );
      console.log('Got clean data:', clean);
      return { total: clean.length, data: clean };
    }
  );
};


class DataExplorer extends React.Component {
  render() {
    return (
      <DataExplorerTable
        config={dummyConfig}
        fetchData={fetchGQL}
      />
    );
  }
}

export default DataExplorer;
