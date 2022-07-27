import Button from '@gen3/ui-component/dist/components/Button';
import PropTypes from 'prop-types';
import copy from 'clipboard-plus';
import React, { Component } from 'react';
import Popup from '../components/Popup';
import { userAPIPath, useArboristUI, indexdPath } from '../configs';
import isEnabled from '../helpers/featureFlags';
import { humanFileSize } from '../utils.js';

import { userHasMethodForServiceOnResource, userHasMethodForServiceOnProject } from '../authMappingUtils';

const DOWNLOAD_BTN_CAPTION = 'Download';
const SIGNED_URL_BTN_CAPTION = 'Generate Signed URL';
const SIGNED_URL_MSG = 'Please copy your signed URL below (this generated signed URL will expire in an hour):';
const SIGNED_URL_ERROR_MSG = 'An error has occurred when generating signed URL:';

function fileTypeTransform(type) {
  let t = type.replace(/_/g, ' '); // '-' to ' '
  t = t.replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize words
  return `| ${t} |`;
}

function projectIsOpenData(projectAvail, projectID) {
  return (projectID in projectAvail && projectAvail[projectID] === 'Open');
}

class CoreMetadataHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadButton: null,
      signedURLButton: null,
    };
  }

  onGenerateSignedURL = () => {
    this.props.onGenerateSignedURL(this.props.metadata.object_id);
  };

  onSignedURLPopupClose = () => {
    this.props.onUpdatePopup({ signedURLPopup: false });
    this.props.onClearSignedURL();
  };

  dateTransform = (date) => `Updated on ${date.substr(0, 10)}`;

  // check if user has permision to download file
  checkPermissions = () => {
    // dont check more then once
    if (this.state.downloadButton) {
      return;
    }
    const { projectAvail } = this.props;
    const projectId = this.props.metadata.project_id;
    fetch(`${indexdPath}${this.props.metadata.object_id}`)
      .then((response) => response.json())
      .then((data) => {
        let userHasAccess = false;
        if (data.authz && data.authz.length > 0) {
          userHasAccess = data.authz.every((resource) => userHasMethodForServiceOnResource('read-storage', 'fence', resource, this.props.userAuthMapping));
        } else {
          // if no authz fall back to old verification method
          userHasAccess = userHasMethodForServiceOnProject('read-storage', 'fence', projectId, this.props.userAuthMapping);
        }

        if (
          !useArboristUI
          || userHasAccess
          || projectIsOpenData(projectAvail, projectId)
        ) {
          const downloadLink = `${userAPIPath}/data/download/${this.props.metadata.object_id}?expires_in=900&redirect`;

          this.setState({
            downloadButton: (
              <a href={downloadLink}>
                <button className='button-primary-orange' type='button'>
                  {DOWNLOAD_BTN_CAPTION}
                </button>
              </a>
            ),
          });

          if (isEnabled('signedURLButton')) {
            this.setState({
              signedURLButton: (
                <Button
                  onClick={() => this.onGenerateSignedURL()}
                  label={SIGNED_URL_BTN_CAPTION}
                  className='core-metadata-page__column--right--signed-url-button'
                  buttonType='primary'
                />
              ),
            });
          }
        } else {
          // set to empty so it wont check again
          this.setState({
            downloadButton: (<React.Fragment />),
          });
        }
      });
  }

  render() {
    if (this.props.metadata) {
      // downloadButton should always render if useArboristUI false. Otherwise according to authz.

      // check if user has permision to download file
      this.checkPermissions();

      const propertiesList = [];
      if (this.props.metadata.data_format) {
        propertiesList.push(this.props.metadata.data_format);
      }
      if (this.props.metadata.file_size) {
        propertiesList.push(humanFileSize(this.props.metadata.file_size));
      }
      if (this.props.metadata.object_id) {
        propertiesList.push(this.props.metadata.object_id);
      }
      if (this.props.metadata.updated_datetime) {
        propertiesList.push(this.dateTransform(this.props.metadata.updated_datetime));
      }
      const properties = propertiesList.join(' | ');

      return (
        <div className='body-typo'>
          <p className='h3-typo'>
            {this.props.metadata.file_name}
            <br />
            {fileTypeTransform(this.props.metadata.type)}
          </p>
          <p className='body-typo'>{this.props.metadata.description}</p>
          { this.state.downloadButton }
          { this.state.signedURLButton }
          {
            this.props.signedURLPopup === true
            && (
              <Popup
                message={(!this.props.error) ? [SIGNED_URL_MSG] : [SIGNED_URL_ERROR_MSG]}
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
            )
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
