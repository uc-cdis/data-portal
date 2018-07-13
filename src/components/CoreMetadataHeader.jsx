import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const DOWNLOAD_BTN_CAPTION = 'Download'

function fileSizeTransform(size) {
  const a = 1024, units = ['B', 'KB', 'MB', 'GB'], decimals = 0;
  let res = parseFloat(size), i = 0;
  while (res > a && i < units.length - 1) {
    res /= a;
    i++;
  }
  return res.toFixed(decimals) + ' ' + units[i];
}

class CoreMetadataHeader extends Component {
  dateTransform = date => 'Updated on ' + date.substr(0, 10);

  render() {
    const onDownloadFile = () => {
        window.location.href = '/user/data/download/' + this.props.metadata.object_id;
    };

    return (
      <div className='body-typo'>
        <p className='h3-typo'>
          {this.props.metadata.file_name}
          <br/>
          | {this.props.metadata.data_type} |
        </p>
        <p className='body-typo'>{this.props.metadata.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button onClick={onDownloadFile} className='button-primary-orange'>
          {DOWNLOAD_BTN_CAPTION}
        </button>
        <div className='body-typo'>
          {this.props.metadata.data_format} | {fileSizeTransform(this.props.metadata.file_size)} | {this.props.metadata.object_id} | {this.dateTransform(this.props.metadata.updated_datetime)}
        </div>
      </div>
    );
  }
}

CoreMetadataHeader.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default CoreMetadataHeader;
