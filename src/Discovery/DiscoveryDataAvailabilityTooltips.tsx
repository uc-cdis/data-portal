import {
  ClockCircleOutlined, DashOutlined, UnlockOutlined, LockOutlined,
} from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';
import { AccessLevel } from './Discovery';

const ARBORIST_READ_PRIV = 'read';

interface Props {
  dataAvailabilityLevel: AccessLevel,
  authzFieldName: string
}

const DiscoveryDataAvailabilityTooltips = (props: Props) => {
  if (props.dataAvailabilityLevel === AccessLevel.WAITING) {
    return (
      <Popover
        overlayClassName='discovery-popover'
        placement='topRight'
        arrowPointAtCenter
        content={(
          <div className='discovery-popover__text'>
            Data are not yet available for this study
          </div>
        )}
      >
        <ClockCircleOutlined className='discovery-table__access-icon' />
      </Popover>
    );
  }
  if (props.dataAvailabilityLevel === AccessLevel.NOT_AVAILABLE) {
    return (
      <Popover
        overlayClassName='discovery-popover'
        placement='topRight'
        arrowPointAtCenter
        content={(
          <div className='discovery-popover__text'>
            No data will be shared by this study
          </div>
        )}
      >
        <DashOutlined className='discovery-table__access-icon' />
      </Popover>
    );
  }
  if (props.dataAvailabilityLevel === AccessLevel.ACCESSIBLE) {
    return (
      <Popover
        overlayClassName='discovery-popover'
        placement='topRight'
        arrowPointAtCenter
        title={'You have access to these data.'}
        content={(
          <div className='discovery-popover__text'>
            <React.Fragment>You have <code>{ARBORIST_READ_PRIV}</code> access to </React.Fragment>
            <React.Fragment><code>{props.authzFieldName}</code>.</React.Fragment>
          </div>
        )}
      >
        <UnlockOutlined className='discovery-table__access-icon' />
      </Popover>
    );
  }
  if (props.dataAvailabilityLevel === AccessLevel.UNACCESSIBLE) {
    return (
      <Popover
        overlayClassName='discovery-popover'
        placement='topRight'
        arrowPointAtCenter
        title={'You do not currently have access to these data.'}
        content={(
          <div className='discovery-popover__text'>
            <React.Fragment>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to </React.Fragment>
            <React.Fragment><code>{props.authzFieldName}</code>. </React.Fragment>
            <React.Fragment>Visit the repository to request access to these data</React.Fragment>
          </div>
        )}
      >
        <LockOutlined className='discovery-table__access-icon' />
      </Popover>
    );
  }
  if (props.dataAvailabilityLevel === AccessLevel.MIXED) {
    return (
      <Popover
        overlayClassName='discovery-popover'
        placement='topRight'
        arrowPointAtCenter
        title={'You have access to some of these data.'}
        content={(
          <div className='discovery-popover__text'>
            <React.Fragment>Some of these data require visiting the repository to request access.</React.Fragment>
          </div>
        )}
      >
        <UnlockOutlined className='discovery-table__access-icon' />
        <LockOutlined className='discovery-table__access-icon' />
      </Popover>
    );
  }
  return <React.Fragment />;
};

export default DiscoveryDataAvailabilityTooltips;
