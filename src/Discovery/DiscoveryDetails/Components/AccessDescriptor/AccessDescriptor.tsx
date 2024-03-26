import React from 'react';
import { Alert } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';

interface NonTabbedDiscoveryDetailsProps {userHasAccess:boolean, userDoesNotHaveAccess:boolean}

const AccessDescriptor = ({ userHasAccess, userDoesNotHaveAccess }: NonTabbedDiscoveryDetailsProps) => {
  if (userHasAccess) {
    return (
      <Alert
        className='discovery-modal__access-alert'
        type='success'
        message={(
          <React.Fragment>
            <UnlockOutlined /> You have access to this data.
          </React.Fragment>
        )}
      />
    );
  }
  if (userDoesNotHaveAccess) {
    return (
      <Alert
        className='discovery-modal__access-alert'
        type='warning'
        message={
          <React.Fragment>You do not have access to this data.</React.Fragment>
        }
      />
    );
  }
  return (
    <Alert
      className='discovery-modal__access-alert'
      type='info'
      message={(
        <React.Fragment>
          This does not include data access authorization details.
        </React.Fragment>
      )}
    />
  );
};

export default AccessDescriptor;
