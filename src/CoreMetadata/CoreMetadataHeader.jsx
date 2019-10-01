import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  userapiPath,
} from '../configs';

const DOWNLOAD_BTN_CAPTION = 'Download';

function fileTypeTransform(type) {
  let t = type.replace(/_/g, ' '); // '-' to ' '
  t = t.replace(/\b\w/g, l => l.toUpperCase()); // capitalize words
  return `| ${t} |`;
}

function fileSizeTransform(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizeStr = (size / (1024 ** i)).toFixed(2) * 1;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'][i];
  return `${sizeStr} ${suffix}`;
}

function canUserDownload(user, projectAvail, projectID) {
  const parts = projectID.split('-');
  const program = parts[0];
  parts.shift();
  const project = parts.join('-');
  let hasAccess = false;
  if (projectID in projectAvail) {
    if (projectAvail[projectID] === 'Open') {
      hasAccess = true;
    }
  }
  if ('project_access' in user && program in user.project_access) {
    if (user.project_access[program].includes('read-storage')) {
      hasAccess = true;
    }
  }
  if ('project_access' in user && project in user.project_access) {
    if (user.project_access[project].includes('read-storage')) {
      hasAccess = true;
    }
  }
  return hasAccess;
}

class CoreMetadataHeader extends Component {
  dateTransform = date => `Updated on ${date.substr(0, 10)}`;

  render() {
    if (this.props.metadata) {
      // display the download button if the user can download this file
      const { user, projectAvail } = this.props;
      const projectId = this.props.metadata.project_id;
      const canDownload = canUserDownload(user, projectAvail, projectId);
      let downloadButton = null;
      if (canDownload) {
        const downloadLink = `${userapiPath}/data/download/${this.props.metadata.object_id}?expires_in=900&redirect`;

        downloadButton = (
          <a href={downloadLink}>
            <button className='button-primary-orange'>
              {DOWNLOAD_BTN_CAPTION}
            </button>
          </a>);
      }

      const properties = `${this.props.metadata.data_format} | ${fileSizeTransform(this.props.metadata.file_size)} | ${this.props.metadata.object_id} | ${this.dateTransform(this.props.metadata.updated_datetime)}`;

      return (
        <div className='body-typo'>
          <p className='h3-typo'>
            {this.props.metadata.file_name}
            <br />
            {fileTypeTransform(this.props.metadata.type)}
          </p>
          <p className='body-typo'>{this.props.metadata.description}</p>
          { downloadButton }
          <div className='body-typo'>{properties}</div>
        </div>
      );
    }

    // if there is no core metadata to display

    return (
      <p className='body-typo'>
        Error: {this.props.error}
      </p>
    );
  }
}

CoreMetadataHeader.propTypes = {
  metadata: PropTypes.object,
  error: PropTypes.string,
  user: PropTypes.object.isRequired,
  projectAvail: PropTypes.object.isRequired,
};

CoreMetadataHeader.defaultProps = {
  metadata: null,
  error: null,
};

export default CoreMetadataHeader;
