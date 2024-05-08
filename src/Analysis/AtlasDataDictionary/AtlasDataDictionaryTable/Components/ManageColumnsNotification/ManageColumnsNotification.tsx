import React, { useEffect } from 'react';
import { Notification } from '@mantine/core';

const ManageColumnsNotification = ({ showNotification, setShowNotification }) => {
  const notificationDisplayTimeInMilliseconds = 3000;
  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, notificationDisplayTimeInMilliseconds);
    }
  }, [showNotification]);

  return (
    <React.Fragment>
      {showNotification && (
        <div
          className='manage-columns-notification'
        >
          <Notification
            icon={<React.Fragment>&#x2713;</React.Fragment>}
            color='teal'
            withCloseButton={false}
            title='Restored column defaults'
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default ManageColumnsNotification;
