import React from 'react';
import PropTypes from 'prop-types';
import { Space, Dropdown, Button, notification } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { fetchPresignedUrlForWorkflowArtifact } from '../../../../Utils/gwasWorkflowApi';

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
              'gwas_archive_index'
            )
              .then((res) => {
                window.open(res, '_blank');
              })
              .catch((error) => {
                notification.open({
                  message: 'Could not download',
                  type: 'error',
                  duration: 0,
                  description: error,
                });
              });
          }}
        >
          Download
        </a>
      ),
      disabled: false,
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
