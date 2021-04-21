import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import PropTypes from 'prop-types';

class DownloadButtonExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manifestCount: 0,
    };
    this.updateManifestCount = this.updateManifestCount.bind(this);
  }

  componentDidUpdate(prevProp) {
    if (this.props.totalCount !== prevProp.totalCount) {
      this.updateManifestCount();
    }
  }

  async updateManifestCount() {
    const nodeID = 'subject_id';
    const fileType = 'file';
    const nodeIDResult = await this.props.downloadRawDataByFields({ fields: [nodeID] });
    if (nodeIDResult) {
      const nodeIDList = nodeIDResult.map(i => i[nodeID]);
      const countResult = await this.props.getTotalCountsByTypeAndFilter(fileType, {
        [nodeID]: {
          selectedValues: nodeIDList,
        },
      });
      this.setState({ manifestCount: countResult });
    } else {
      throw Error('Error when downloading data');
    }
  }

  async downloadData() {
    const res = await this.props.downloadRawData();
    if (res) {
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'text/json' });
      const fileName = 'download.json';
      FileSaver.saveAs(blob, fileName);
    } else {
      throw Error('Error when downloading data');
    }
  }

  async downloadManifest() {
    const fileType = 'file';
    const nodeID = 'subject_id';
    const nodeIDList = await this.props.downloadRawDataByFields({ fields: [nodeID] }).then(res => res.map(i => i[nodeID]));
    const resultManifest = await this.props.downloadRawDataByTypeAndFilter(
      fileType, {
        [nodeID]: {
          selectedValues: nodeIDList,
        },
      },
      ['file_id', 'subject_id'],
    );
    if (resultManifest) {
      const blob = new Blob([JSON.stringify(resultManifest, null, 2)], { type: 'text/json' });
      const fileName = 'manifest.json';
      FileSaver.saveAs(blob, fileName);
    } else {
      throw Error('Error when downloading manifest');
    }
  }

  render() {
    return (
      <React.Fragment>
        <Button
          label={`download ${this.props.totalCount} ${this.props.guppyConfig.type} data`}
          onClick={this.downloadData.bind(this)}
        />
        <Button
          label={`download ${this.state.manifestCount} ${this.props.guppyConfig.fileType} manifest`}
          onClick={this.downloadManifest.bind(this)}
        />
      </React.Fragment>
    );
  }
}

DownloadButtonExample.propTypes = {
  downloadRawData: PropTypes.func,
  downloadRawDataByFields: PropTypes.func,
  getTotalCountsByTypeAndFilter: PropTypes.func,
  downloadRawDataByTypeAndFilter: PropTypes.func,
  totalCount: PropTypes.number,
  filter: PropTypes.object,
};

export default DownloadButtonExample;
