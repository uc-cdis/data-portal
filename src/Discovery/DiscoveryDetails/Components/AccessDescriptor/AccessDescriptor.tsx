import React from 'react';
import { Alert } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';
import { AccessLevel } from '../../../Discovery';

interface NonTabbedDiscoveryDetailsProps {accessibleFieldValue: AccessLevel}

const AccessDescriptor = ({ accessibleFieldValue }: NonTabbedDiscoveryDetailsProps) => {
  if (accessibleFieldValue === AccessLevel.ACCESSIBLE) {
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
  if (accessibleFieldValue === AccessLevel.UNACCESSIBLE) {
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
  if (accessibleFieldValue === AccessLevel.MIXED) {
    return (
      <Alert
        className='discovery-modal__access-alert'
        type='info'
        message={
          <React.Fragment>This dataset contains mixed availabilities.</React.Fragment>
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
