import React from 'react';
import { Space, Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: (
      <a target='_blank' rel='noopener noreferrer' href='#'>
        Download
      </a>
    ),
    disabled: true,
  },
];

const ActionsDropdown = () => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <Space>
      <Button type='text'>
        <EllipsisOutlined />
      </Button>
    </Space>
  </Dropdown>
);

export default ActionsDropdown;
