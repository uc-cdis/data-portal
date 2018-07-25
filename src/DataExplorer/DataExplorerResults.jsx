import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import DataExplorerTable from '../components/tables/DataExplorerTable';

class DataExplorerResults extends React.Component {
  render() {
    return (
      <div className="data-explorer__results">
        <CurrentSQON {...this.props} />
        <DataExplorerTable {...this.props} />
      </div>
    )
  }
}

export default DataExplorerResults;
