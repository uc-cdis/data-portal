import React from 'react';
import { Button, Modal } from 'antd';
import DownloadStatus from '../../Interfaces/DownloadStatus';

interface DownloadAllModalPropsInterface {
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus),
}

const DownloadAllModal = ({
  downloadStatus,
  setDownloadStatus
}: DownloadAllModalPropsInterface) => {
  return (
    <Modal
      closable={false}
      open={downloadStatus.message.active}
      title={downloadStatus.message.title}
      footer={
        <Button
          onClick={() =>
            setDownloadStatus({
              ...downloadStatus,
              message: {
                title: '',
                content: <React.Fragment />,
                active: false,
              },
            })
          }
        >
          Close
        </Button>
      }
    >
      {downloadStatus.message.content}
    </Modal>
  );
};
export default DownloadAllModal;
