import React from 'react';
import PropTypes from 'prop-types';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import DataTable from '@arranger/components/dist/DataTable';
import IconicButton from '../../buttons/IconicButton';
import dictIcons from '../../../img/icons';
import './DataExplorerTable.less';

class DataExplorerTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTableRows: [],
      downloading: false,
    };
    this.onBDBagDownload = this.onBDBagDownload.bind(this);
    this.onClinicalDownload = this.onClinicalDownload.bind(this);
  }

  onBDBagDownload() {
    // TODO: export selected rows
    this.setState({ downloading: true });
  }

  onClinicalDownload() {
    // TODO: export selected rows
    this.setState({ downloading: true });
  }

  setSelectedTableRows(rows) {
    this.setState({ selectedTableRows: rows });
  }

  render() {
    return (
      <div className="data-explorer-table">
        <div className="data-explorer-table__download-buttons">
          <IconicButton
            buttonClassName="data-explorer-table__button"
            caption="Download BDBag Manifest"
            onClick={this.onBDBagDownload}
            dictIcons={dictIcons}
            icon="download"
            iconColor="#9b9b9b"
          />
          <IconicButton
            buttonClassName="data-explorer-table__button"
            caption="Download Clinical"
            onClick={this.onClinicalDownload}
            dictIcons={dictIcons}
            icon="download"
            iconColor="#9b9b9b"
          />
        </div>
        <div className="data-explorer-table__arranger-table">
          <DataTable
            config={this.props.config}
            fetchData={this.props.fetchData}
            setSelectedTableRows={rows => this.setSelectedTableRows(rows)}
            allowTSVExport={false}
            allowTogglingColumns={false}
          />
        </div>
      </div>
    );
  }
}

DataExplorerTable.propTypes = {
  config: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
}

export default DataExplorerTable;
