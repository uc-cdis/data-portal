import React, { useState } from 'react';
import {
  Col, Row, Button, Popover,
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import UseHandleRedirectToLoginClick from './DownloadUtils/UseHandleRedirectToLoginClick';
import HandleDownloadManifestClick from './DownloadUtils/HandleDownloadManifestClick';
import DownloadAllModal from './DownloadAllModal/DownloadAllModal';
import DownloadAllFiles from './DownloadUtils/DownloadAllFiles/DownloadAllFiles';
import DownloadJsonFile from './DownloadUtils/DownloadJsonFile';
import { DiscoveryConfig } from '../../../DiscoveryConfig';
import './ActionButtons.css';

interface ActionButtonsProps {
  isUserLoggedIn: boolean;
  discoveryConfig: DiscoveryConfig;
  resourceInfo: any;
  healLoginNeeded: boolean;
  noData: boolean;
}

const ActionButtons = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  healLoginNeeded,
  noData,
}: ActionButtonsProps): JSX.Element => {
  const { HandleRedirectToLoginClick } = UseHandleRedirectToLoginClick();
  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });
  const history = useHistory();
  const location = useLocation();
  const showDownloadStudyLevelMetadataButtons: boolean | undefined = discoveryConfig?.features.exportToWorkspace.studyMetadataFieldName
    && discoveryConfig?.features.exportToWorkspace.enableDownloadStudyMetadata
    && resourceInfo?.study_metadata;
  const showDownloadFileManifestButtons: boolean | undefined = discoveryConfig?.features.exportToWorkspace.enableDownloadManifest;
  const showDownloadAllFilesButtons: boolean | undefined = discoveryConfig?.features.exportToWorkspace.enableDownloadZip;
  const verifyExternalLoginsNeeded: boolean | undefined = discoveryConfig?.features.exportToWorkspace.verifyExternalLogins;
  const manifestFieldName: string | undefined = discoveryConfig?.features.exportToWorkspace.manifestFieldName;

  const ConditionalPopover = ({ children }) => (noData ? (
    <Popover title={'This file is not available for the selected study'}>
      {children}
    </Popover>
  ) : (
    children
  ));

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
            <ConditionalPopover>
              <Button
                className='discovery-action-bar-button'
                disabled={noData}
                onClick={() => DownloadJsonFile(
                  'study-level-metadata',
                  resourceInfo.study_metadata,
                )}
              >
                Download <br />
                Study-Level Metadata
              </Button>
            </ConditionalPopover>
          </Col>
        )}
        {showDownloadFileManifestButtons && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && !healLoginNeeded && (
              <ConditionalPopover>
                <Button
                  className='discovery-action-bar-button'
                  disabled={noData}
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
              </ConditionalPopover>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                disabled={noData}
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
              <ConditionalPopover>
                <Button
                  className='discovery-action-bar-button'
                  disabled={noData}
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
              </ConditionalPopover>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                disabled={noData}
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
