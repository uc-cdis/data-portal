import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import { Table } from '@arranger/components/dist/DataTable';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import IconicButton from '../buttons/IconicButton';
import dictIcons from '../../img/icons';

const DataExplorerTableHeader = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  display: flex;
  h3 {
    margin-right: 10px;
  }
  margin-bottom: 10px;
`
const DownloadButton = styled.div`
  margin-right: 10px;
  button {
    width: 220px;
    height: 40px;
    padding: 2px 2px;
    outline: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    background-color: #fff;
    color: #9b9b9b;
    font-size: 14px;
    svg path {
      fill: #9b9b9b;
    }
  }
  button:hover {
    background-color: #ff9635 !important;
    border: 1px solid #e7e7e7 !important;
    color: #fff;
    svg path {
      fill: #fff;
    }
  }
`

const ArrangerTable = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  .ReactTable .rt-thead {
    background-color: #fff;
  }

  .ReactTable .rt-thead.-header {
    box-shadow: 0 0px 0px 0;
  }

  .ReactTable .rt-thead .rt-th.-sort-asc,
  .ReactTable .rt-thead .rt-td.-sort-asc {
    box-shadow: 0 0px 0px 0;
  }

  .ReactTable .rt-th, .ReactTable .rt-td {
    white-space: normal;
    outline: none !important;
  }
  .ReactTable .rt-thead .rt-tr {
    text-align: left;
  }

  .ReactTable .rt-thead .rt-th, .ReactTable .rt-thead .rt-td {
    border-right: 0px;
  }

  .ReactTable .rt-resizable-header-content {
    color: #000;
  }
`

class DataExplorerTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTableRows: [],
      downloading: false,
    };
    this.onBDBagDownload = this.onBDBagDownload.bind(this);
  }

  setSelectedTableRows(rows) {
    this.setState({ selectedTableRows: rows });
  }

  onBDBagDownload() {
    // TODO: export selected rows
    this.setState({ downloading: true });
  }

  render() {
    return (
      <div>
        <DataExplorerTableHeader>
          <h3>Showing 1-20 models of 2,111 Subjects</h3>
          <DownloadButton>
            <IconicButton
              caption="Download BDBag Manifest"
              onClick={this.onBDBagDownload}
              dictIcons={dictIcons}
              icon="download"
              iconColor="#9b9b9b"
            />
          </DownloadButton>
        </DataExplorerTableHeader>
        <ArrangerTable>
          <Table
            config={this.props.config}
            fetchData={this.props.fetchData}
            setSelectedTableRows={rows => this.setSelectedTableRows(rows)}
            allowTSVExport={false}
          />
        </ArrangerTable>
      </div>
    );
  }
}

DataExplorerTable.propTypes = {
  config: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
}

export default DataExplorerTable;
