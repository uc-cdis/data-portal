import React from 'react';
import { Space, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const items =  [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Download
        </a>
      ),
      disabled: true,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Rerun
        </a>
      ),
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Archive Job
        </a>
      ),
      disabled: true,
    }
  ];

const ActionsDropdown = () =>
    <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
            <Space>
                <EllipsisOutlined />
            </Space>
        </a>
    </Dropdown>

export default ActionsDropdown;
