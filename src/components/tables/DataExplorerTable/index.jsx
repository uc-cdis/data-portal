import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@arranger/components/dist/Arranger';
import './DataExplorerTable.less';

class DataExplorerTable extends React.Component {
  render() {
    return (
      <div className="data-explorer-table">
        <div className="data-explorer-table__arranger-table">
          <Table
            {...this.props}
            allowTSVExport={false}
            allowTogglingColumns={false}
          />
        </div>
      </div>
    );
  }
}

DataExplorerTable.propTypes = {
  arrangerConfig: PropTypes.object,
  arrangerData: PropTypes.object,
};

DataExplorerTable.defaultProps = {
  arrangerConfig: {},
  arrangerData: null,
};

export default DataExplorerTable;
