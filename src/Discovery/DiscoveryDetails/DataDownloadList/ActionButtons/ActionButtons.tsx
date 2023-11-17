import React, { useState } from 'react';
import { Col, Row, Button } from 'antd';
import UseHandleRedirectToLoginClick from './DownloadUtils/UseHandleRedirectToLoginClick';
import HandleDownloadManifestClick from './DownloadUtils/HandleDownloadManifestClick';
import DownloadAllModal from './DownloadAllModal/DownloadAllModal';
import DownloadAllFiles from './DownloadUtils/DownloadAllFiles';
import DownloadJsonFile from './DownloadUtils/DownloadJsonFile';
import './ActionButtons.css';

const ActionButtons = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
}): JSX.Element => {
  const { HandleRedirectToLoginClick } = UseHandleRedirectToLoginClick();

  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });
  const studyIDs = [resourceInfo?.study_id];

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
        {discoveryConfig?.features.exportToWorkspace.studyMetadataFieldName &&
          discoveryConfig?.features.exportToWorkspace
            .enableDownloadStudyMetadata &&
          resourceInfo?.study_metadata && (
            <Col flex='1 0 auto'>
              <Button
                className='discovery-action-bar-button'
                onClick={() =>
                  DownloadJsonFile(
                    'study-level-metadata',
                    resourceInfo.study_metadata
                  )
                }
              >
                Download <br />
                Study-Level Metadata
              </Button>
            </Col>
          )}
        {discoveryConfig?.features.exportToWorkspace.enableDownloadManifest && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => {
                  HandleDownloadManifestClick(
                    discoveryConfig,
                    [resourceInfo],
                    false
                  );
                }}
              >
                Download File Manifest
              </Button>
            )}
            {!isUserLoggedIn && (
              <Button
                className='discovery-action-bar-button'
                onClick={() => {
                  HandleRedirectToLoginClick(
                    resourceInfo,
                    discoveryConfig,
                    'manifest'
                  );
                }}
              >
                Login to
                <br /> Download Manifest
              </Button>
            )}
          </Col>
        )}
        {discoveryConfig?.features.exportToWorkspace.enableDownloadZip && (
          <Col flex='1 0 auto'>
            <Button
              className='discovery-action-bar-button'
              onClick={() =>
                DownloadAllFiles(studyIDs, downloadStatus, setDownloadStatus)
              }
            >
              Download All Files
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default ActionButtons;
