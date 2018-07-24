import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import fileDownload from 'js-file-download';
import IconicButton from '../../buttons/IconicButton';
import dictIcons from '../../../img/icons';
import './DataExplorerTable.less';

class DataExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTableRows: [],
    };
    this.onBDBagDownload = this.onBDBagDownload.bind(this);
    this.onClinicalDownload = this.onClinicalDownload.bind(this);
  }

  onBDBagDownload() {
    // TODO: look up selected data by id and download as CSV
    fileDownload(this.state.selectedTableRows, 'BDBagManifest.csv');
  }

  onClinicalDownload() {
    // TODO: look up selected data by id and download as CSV
    fileDownload(this.state.selectedTableRows, 'Clinical.csv');
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
};

export default DataExplorerTable;
