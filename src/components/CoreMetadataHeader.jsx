import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const DOWNLOAD_BTN_CAPTION = 'Download'

class CoreMetadataHeader extends Component {
  dateTransform = date => 'Updated on ' + date.substr(0, 10);

  // TODO: transform to B, KB or MB
  fileSizeTransform = size => size + ' B';

  render() {
    const onDownloadFile = () => {
        window.location.href = '/user/data/download/' + this.props.metadata.object_id;
    };

    return (
      <div>
        <p className='h3-typo'>
          {this.props.metadata.file_name}
          <br/>
          | {this.props.metadata.data_type} |
        </p>
        <p className='body-typo'>{this.props.metadata.description}
        <br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p className='body-typo'>
          <button onClick={onDownloadFile} className='button-primary-orange'>
            {DOWNLOAD_BTN_CAPTION}
          </button>
          <br/>
          {this.props.metadata.data_format} | {this.fileSizeTransform(this.props.metadata.file_size)} | {this.props.metadata.object_id} | {this.dateTransform(this.props.metadata.updated_datetime)}
        </p>
      </div>
    );
  }
}

CoreMetadataHeader.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default CoreMetadataHeader;
