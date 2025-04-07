import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Popover, Button, Modal } from 'antd';
import handleDownloadZipClick from '../utils/handleDownloadZipClick';
import { handleRedirectToLoginClickResumable } from '../../Utils/HandleRedirectToLoginClick';

const DownloadZipButton = ({
  props,
  healIDPLoginNeeded,
  onlyInCommonMsg,
  downloadStatus,
  setDownloadStatus,
  history,
  location,
}) => {
  const checkIfDownloadZipDisabled = () => {
    const noSelectedResources = props.discovery.selectedResources.length === 0;
    const downloadInProgress = downloadStatus.inProgress;
    const eachSelectedResourcesIsMissingManifest = props.discovery.selectedResources.every(
      (item: object) => item.__manifest === '',
    );
    return (noSelectedResources || downloadInProgress || eachSelectedResourcesIsMissingManifest);
  };

  return props.config.features.exportToWorkspace?.enableDownloadZip ? (
    <React.Fragment>
      <Popover
        className='discovery-popover'
        arrowPointAtCenter
        content={(
          <React.Fragment>
            {healIDPLoginNeeded.length > 0
              ? onlyInCommonMsg
              : 'Directly download data (up to 250Mb) from selected studies'}
          </React.Fragment>
        )}
      >
        <Button
          onClick={async () => {
            if (props.user.username && !(healIDPLoginNeeded.length > 0)) {
              handleDownloadZipClick(
                props.config,
                props.discovery.selectedResources,
                downloadStatus,
                setDownloadStatus,
                history,
                location,
                healIDPLoginNeeded.length > 0,
              );
            } else {
              handleRedirectToLoginClickResumable(
                'download',
                props,
                history,
                location,
              );
            }
          }}
          type='default'
          className={`discovery-action-bar-button${
            props.discovery.selectedResources.length === 0 ? '--disabled' : ''
          }`}
          disabled={checkIfDownloadZipDisabled()}
          icon={<DownloadOutlined />}
          loading={downloadStatus.inProgress}
        >
          {(() => {
            if (props.user.username && !(healIDPLoginNeeded.length > 0)) {
              if (downloadStatus.inProgress) {
                return 'Preparing download...';
              }
              return `${
                props.config.features.exportToWorkspace.downloadZipButtonText
                || 'Download Zip'
              }`;
            }
            return `Login to ${
              props.config.features.exportToWorkspace.downloadZipButtonText
              || 'Download Zip'
            }`;
          })()}
        </Button>
      </Popover>
      <Modal
        closable={false}
        open={downloadStatus.message.active && !props.systemPopupActivated}
        title={downloadStatus.message.title}
        footer={(
          <Button
            onClick={() => setDownloadStatus({
              ...downloadStatus,
              message: {
                title: '',
                content: <React.Fragment />,
                active: false,
              },
            })}
          >
            Close
          </Button>
        )}
      >
        {downloadStatus.message.content}
      </Modal>
    </React.Fragment>
  ) : null;
};

export default DownloadZipButton;
