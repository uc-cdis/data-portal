import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const DOWNLOAD_BTN_CAPTION = 'Download'

function fileTypeTransform(type) {
  let t = type.replace(/_/g, ' '); // '-' to ' '
  t = t.replace(/\b\w/g, l => l.toUpperCase()); // capitalize words
  return '| ' + t + ' |';
}

function fileSizeTransform(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizeStr = (size / (1024 ** i)).toFixed(2) * 1;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'][i];
  return `${sizeStr} ${suffix}`;
}

function canUserDownload(user, projectAvail, projectID, did, name) {
  const parts = projectID.split('-');
  const program = parts[0];
  const project = parts[1];
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
  hasAccess = true; // TODO: remove
  return hasAccess;
}

class CoreMetadataHeader extends Component {
  dateTransform = date => 'Updated on ' + date.substr(0, 10);

  render() {

    // display the download button if the user can download this file
    const user = this.props.user, projectAvail = this.props.projectAvail, project_id = this.props.metadata.project_id, did = this.props.metadata.object_id, name = this.props.metadata.file_name;
    const canDownload = canUserDownload(user, projectAvail, project_id, did, name);
    let downloadButton = null;
    if (canDownload) {
      downloadButton =
      <button
        onClick={this.props.onDownloadFile}
        className='button-primary-orange'>
        {DOWNLOAD_BTN_CAPTION}
      </button>
    }

    return (
      <div className='body-typo'>
        <p className='h3-typo'>
          {this.props.metadata.file_name}
          <br/>
          {fileTypeTransform(this.props.metadata.type)}
        </p>
        <p className='body-typo'>{this.props.metadata.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> {/* TODO: remove lorem ipsum */}
        { downloadButton }
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
  user: PropTypes.object.isRequired,
  projectAvail: PropTypes.object.isRequired,
};

export default CoreMetadataHeader;
