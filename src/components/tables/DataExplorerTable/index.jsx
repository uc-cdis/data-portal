import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@arranger/components/dist/Arranger';
import './DataExplorerTable.less';

class DataExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTableRows: [],
    };
  }

  setSelectedTableRows = (selectedTableRows) => {
    this.props.setSelectedTableRows(selectedTableRows);
    this.setState({ selectedTableRows });
    this.props.onSelectedRowsChange(selectedTableRows);
  };

  render() {
    return (
      <div className='data-explorer-table'>
        <div className='data-explorer-table__arranger-table'>
          <Table
            {...this.props}
            allowTSVExport={false}
            allowTogglingColumns={false}
            customActions={this.props.customActions}
            selectedTableRows={this.state.selectedTableRows}
            setSelectedTableRows={this.setSelectedTableRows}
          />
        </div>
      </div>
    );
  }
}

DataExplorerTable.propTypes = {
  dataExplorerConfig: PropTypes.object,
  arrangerData: PropTypes.object,
  customActions: PropTypes.object,
  onSelectedRowsChange: PropTypes.func,
  setSelectedTableRows: PropTypes.func,
};

DataExplorerTable.defaultProps = {
  dataExplorerConfig: {},
  arrangerData: null,
  customActions: null,
  onSelectedRowsChange: () => {},
  setSelectedTableRows: () => {},
};

export default DataExplorerTable;
