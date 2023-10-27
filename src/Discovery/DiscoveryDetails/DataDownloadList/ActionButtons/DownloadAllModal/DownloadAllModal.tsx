import React from 'react';
import { Button, Modal } from 'antd';

const DownloadAllModal = ({ downloadStatus, setDownloadStatus }) => {
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
