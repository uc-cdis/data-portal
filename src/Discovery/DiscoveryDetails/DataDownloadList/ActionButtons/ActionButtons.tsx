import React, { useState } from 'react';
import { Col, Row, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import UseHandleRedirectToLoginClick from './DownloadUtils/UseHandleRedirectToLoginClick';
import HandleDownloadManifestClick from './DownloadUtils/HandleDownloadManifestClick';
import DownloadAllModal from './DownloadAllModal/DownloadAllModal';
import DownloadAllFiles from './DownloadUtils/DownloadAllFiles/DownloadAllFiles';
import DownloadJsonFile from './DownloadUtils/DownloadJsonFile';
import './ActionButtons.css';

const ActionButtons = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  healLoginNeeded,
}): JSX.Element => {
  const { HandleRedirectToLoginClick } = UseHandleRedirectToLoginClick();
  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });
  const history = useHistory();
  const location = useLocation();
  const showDownloadStudyLevelMetadataButtons: boolean = discoveryConfig?.features.exportToWorkspace.studyMetadataFieldName
    && discoveryConfig?.features.exportToWorkspace.enableDownloadStudyMetadata
    && resourceInfo?.study_metadata;
  const showDownloadFileManifestButtons: boolean = discoveryConfig?.features.exportToWorkspace.enableDownloadManifest;
  const showDownloadAllFilesButtons: boolean = discoveryConfig?.features.exportToWorkspace.enableDownloadZip;
  const verifyExternalLoginsNeeded: boolean = discoveryConfig?.features.exportToWorkspace.verifyExternalLogins;
  const manifestFieldName: string = discoveryConfig?.features.exportToWorkspace.manifestFieldName;

  return (
    <div className='discovery-modal_buttons-row' data-testid='actionButtons'>
      <DownloadAllModal
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <Row className='row'>
        {/*
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Variable-Level Metadata
          </Button>
        </Col>
        */}
        {showDownloadStudyLevelMetadataButtons && (
          <Col flex='1 0 auto'>
            <Button
              className='discovery-action-bar-button'
              onClick={() => DownloadJsonFile(
                'study-level-metadata',
                resourceInfo.study_metadata,
              )}
            >
              Download <br />
              Study-Level Metadata
            </Button>
          </Col>
        )}
        {showDownloadFileManifestButtons && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && !healLoginNeeded && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => {
                  HandleDownloadManifestClick(
                    discoveryConfig,
                    [resourceInfo],
                    healLoginNeeded,
                  );
                }}
              >
                Download File Manifest
              </Button>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => {
                  HandleRedirectToLoginClick(
                    resourceInfo,
                    discoveryConfig,
                    'manifest',
                  );
                }}
              >
                Login to
                <br /> Download Manifest
              </Button>
            )}
          </Col>
        )}
        {showDownloadAllFilesButtons && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && !healLoginNeeded && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => DownloadAllFiles(
                  resourceInfo,
                  downloadStatus,
                  setDownloadStatus,
                  history,
                  location,
                  healLoginNeeded,
                  verifyExternalLoginsNeeded,
                  manifestFieldName,
                )}
              >
                Download All Files
              </Button>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => {
                  HandleRedirectToLoginClick(
                    resourceInfo,
                    discoveryConfig,
                    'download',
                  );
                }}
              >
                Login to
                <br /> Download All Files
              </Button>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
};
export default ActionButtons;
