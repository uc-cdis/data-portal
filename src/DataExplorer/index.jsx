import React from 'react';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';
import { components } from '../params';
import { fetchDataForArrangerTable } from '../actions';

class DataExplorer extends React.Component {
  render() {
    const tableProperties = components.dataExplorerTableProperties;
    return (
      <DataExplorerTable
        config={tableProperties.tableConfig}
        fetchData={fetchDataForArrangerTable}
      />
    );
  }
}

export default DataExplorer;
