import React from 'react';
import PropTypes from 'prop-types';
import { Space, Dropdown, Button, notification } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import {
  fetchPresignedUrlForWorkflowArtifact, retryWorkflow,
} from '../../../../Utils/gwasWorkflowApi';
import PHASES from '../../../../Utils/PhasesEnumeration';

const ActionsDropdown = ({ record }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (notificationMessage) => {
    api.open({
      message: notificationMessage,
      description: '',
      duration: 0,
    });
  }
  const items = [
    {
      key: '1',
      label: (
        <a
          href=''
          onClick={(e) => {
            e.preventDefault();
            fetchPresignedUrlForWorkflowArtifact(
              record.name,
              record.uid,
              'gwas_archive_index',
            ).then((res) => {
              window.open(res, '_blank');
            }).catch((error) => {
              openNotification(`❌ Could not download. \n\n${error}`);
            });
          }}
        >
          Download
        </a>
      ),
      disabled: false,
    },
    {
      key: '2',
      label: (
        <a
          href=''
          onClick={(e) => {
            e.preventDefault();
            retryWorkflow(
              record.name,
              record.uid,
            ).then(() => {
              openNotification('Workflow successfully restarted.');
            }).catch((error) => {
              openNotification('❌ Retry request failed.');
              console.log(error.stack);
            });
          }}
        >
          Retry
        </a>
      ),
      disabled: (!(record.phase === PHASES.Error || record.phase === PHASES.Failed)),
    },
  ];

  return (
    <>
      {contextHolder}
      <Dropdown menu={{ items }} trigger={['click']}>
        <Space>
          <Button type='text'>
            <EllipsisOutlined />
          </Button>
        </Space>
      </Dropdown>
    </>
  );
};

ActionsDropdown.propTypes = {
  record: PropTypes.object.isRequired,
};

export default ActionsDropdown;
