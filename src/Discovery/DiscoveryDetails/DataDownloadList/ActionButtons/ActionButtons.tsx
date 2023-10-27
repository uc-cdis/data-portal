import React, { useState } from 'react';
import { Col, Row, Button, Modal } from 'antd';
import HandleDownloadManifestClick from './DownloadUtils/HandleDownloadManifestClick';
import DownloadAllModal from './DownloadAllModal/DownloadAllModal';
import './ActionButtons.css';
import DownloadAllFiles from './DownloadUtils/DownloadAllFiles';

const ActionButtons = ({
  discoveryConfig,
  resourceInfo,
  data,
}): JSX.Element => {
  console.log('resourceInfo ', resourceInfo);
  console.log('study_id', resourceInfo.study_id);
  console.log('data', data);

  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });
  const studyIDs = [resourceInfo.study_id];

  return (
    <div className='discovery-modal_buttons-row'>
      <DownloadAllModal
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <Row className='row'>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Variable-Level Metadata
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Study-Level Metadata
          </Button>
        </Col>
        {discoveryConfig.features.exportToWorkspace.enableDownloadManifest && (
          <Col flex='1 0 auto'>
            <Button
              className='discovery-action-bar-button'
              onClick={() => {
                console.log('discoveryConfig', discoveryConfig);
                HandleDownloadManifestClick(
                  discoveryConfig,
                  [resourceInfo],
                  false
                );
              }}
            >
              Download File Manifest
            </Button>
          </Col>
        )}
        {discoveryConfig.features.exportToWorkspace.enableDownloadZip && (
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
