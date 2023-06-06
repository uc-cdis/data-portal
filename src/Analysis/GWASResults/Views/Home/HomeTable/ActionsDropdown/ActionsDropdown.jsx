import React from 'react';
import PropTypes from 'prop-types';
import { Space, Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import {
  fetchPresignedUrlForWorkflowArtifact, retryWorkflow,
} from '../../../../Utils/gwasWorkflowApi';
import PHASES from '../../../../Utils/PhasesEnumeration';

/* eslint no-alert: 0 */ // --> OFF

const ActionsDropdown = ({ record }) => {
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
              alert(`Could not download. \n\n${error}`);
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
              alert('Workflow successfully restarted.');
            }).catch((error) => {
              alert(`Retry request failed. \n\n${error}`);
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
    <Dropdown menu={{ items }} trigger={['click']}>
      <Space>
        <Button type='text'>
          <EllipsisOutlined />
        </Button>
      </Space>
    </Dropdown>
  );
};

ActionsDropdown.propTypes = {
  record: PropTypes.object.isRequired,
};

export default ActionsDropdown;
