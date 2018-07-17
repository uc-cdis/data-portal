import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { userapiPath } from '../localconf';

const DOWNLOAD_BTN_CAPTION = 'Download'

function fileTypeTransform(type) {
  let t = type.replace(/-/g, ' '); // '-' to ' '
  t = t.replace(/\b\w/g, l => l.toUpperCase()); // capitalize words
  return '| ' + t + ' |';
}

function fileSizeTransform(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizeStr = (size / (1024 ** i)).toFixed(2) * 1;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'][i];
  return `${sizeStr} ${suffix}`;
}

class CoreMetadataHeader extends Component {
  dateTransform = date => 'Updated on ' + date.substr(0, 10);

  render() {
    // const onDownloadFile = () => {
    //     window.location.href = `${userapiPath}data/download/${this.props.metadata.object_id}?expires_in=10&redirect`;
    // };

    return (
      <div className='body-typo'>
        <p className='h3-typo'>
          {this.props.metadata.file_name}
          <br/>
          {/* {fileTypeTransform(this.props.metadata.type)} // TODO */}
          {fileTypeTransform(this.props.metadata.data_type)}
        </p>
        <p className='body-typo'>{this.props.metadata.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button
          onClick={this.props.onDownloadFile}
          className='button-primary-orange'>
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
  onDownloadFile: PropTypes.func.isRequired,
};

export default CoreMetadataHeader;
