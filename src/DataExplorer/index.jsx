import React from 'react';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';
import multisort from 'multisort';

const dummyConfig = {
  timestamp: '2018-01-12T16:42:07.495Z',
  type: 'subjects',
  keyField: 'name',
  defaultSorted: [{ id: 'name', desc: false }],
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
      ),
    }
  ).then(
    res => res.json()
  ).then(
    (json) => {
      const cleanData = json.data.subject.hits.edges.map( it => it.node );
      const searchCriteria = sort.map(s =>
        s.order == 'desc' ? '~'.concat(s.field) : s.field.toString()
      )
      return {
        total: cleanData.length,
        data: multisort(cleanData, searchCriteria).slice(offset, offset + first)
      };
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
