import Button from '@gen3/ui-component/dist/components/Button';
import PropTypes from 'prop-types';
import copy from 'clipboard-plus';
import React, { Component } from 'react';
import Popup from '../components/Popup';
import { userapiPath, useArboristUI } from '../configs';
import isEnabled from '../helpers/featureFlags';

import { userHasMethodOnProject } from '../authMappingUtils';

const DOWNLOAD_BTN_CAPTION = 'Download';
const SIGNED_URL_BTN_CAPTION = 'Generate Signed URL';
const SIGNED_URL_MSG = 'Please copy your signed URL below (this generated signed URL will expire in an hour):';
const SIGNED_URL_ERROR_MSG = 'An error has occurred when generating signed URL:';

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

function projectIsOpenData(projectAvail, projectID) {
  return (projectID in projectAvail && projectAvail[projectID] === 'Open');
}

class CoreMetadataHeader extends Component {
  onGenerateSignedURL = () => {
    this.props.onGenerateSignedURL(this.props.metadata.object_id);
  };

  onSignedURLPopupClose = () => {
    this.props.onUpdatePopup({ signedURLPopup: false });
    this.props.onClearSignedURL();
  };

  dateTransform = date => `Updated on ${date.substr(0, 10)}`;

  render() {
    if (this.props.metadata) {
      const { projectAvail } = this.props;
      const projectId = this.props.metadata.project_id;
      let downloadButton = null;
      let signedURLButton = null;

      // downloadButton should always render if useArboristUI false. Otherwise according to authz.
      if (
        !useArboristUI
        || userHasMethodOnProject('read-storage', projectId, this.props.userAuthMapping)
        || projectIsOpenData(projectAvail, projectId)
      ) {
        const downloadLink = `${userapiPath}/data/download/${this.props.metadata.object_id}?expires_in=900&redirect`;

        downloadButton = (
          <a href={downloadLink}>
            <button className='button-primary-orange'>
              {DOWNLOAD_BTN_CAPTION}
            </button>
          </a>);

        if (isEnabled('signedURLButton')) {
          signedURLButton = (<Button
            onClick={() => this.onGenerateSignedURL()}
            label={SIGNED_URL_BTN_CAPTION}
            className='core-metadata-page__column--right--signed-url-button'
            buttonType='primary'
          />);
        }
      }

      if (!this.props.metadata.data_format) {
        /* eslint no-console: ["error", { allow: ["error"] }] */
        console.error('WARNING: null value found for mandatory field \'data_format\', please verify the correctness of metadata');
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
          { signedURLButton }
          {
            this.props.signedURLPopup === true &&
            <Popup
              message={(!this.props.error) ? SIGNED_URL_MSG : SIGNED_URL_ERROR_MSG}
              error={this.props.error}
              lines={(!this.props.error) ? [
                { code: this.props.signedURL },
              ] : []}
              title='Generated Signed URL'
              leftButtons={[
                {
                  caption: 'Close',
                  fn: () => this.onSignedURLPopupClose(),
                },
              ]}
              rightButtons={[
                {
                  caption: 'Copy',
                  fn: () => copy(this.props.signedURL),
                  icon: 'copy',
                  enabled: (!this.props.error),
                },
              ]}
              onClose={() => this.onSignedURLPopupClose()}
            />
          }
          <div className='body-typo'>{properties}</div>
        </div>
      );
    }

    // if there is no core metadata to display

    return (
      <React.Fragment />
    );
  }
}

CoreMetadataHeader.propTypes = {
  metadata: PropTypes.object,
  signedURL: PropTypes.string,
  signedURLPopup: PropTypes.bool,
  error: PropTypes.string,
  projectAvail: PropTypes.object.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  onGenerateSignedURL: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onClearSignedURL: PropTypes.func.isRequired,
};

CoreMetadataHeader.defaultProps = {
  metadata: null,
  signedURL: null,
  signedURLPopup: false,
  error: null,
};

export default CoreMetadataHeader;
