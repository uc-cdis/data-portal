import React from 'react';
import { Space, Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: (
      <a
        href='javascript: void(0)'
        onClick={() => alert('Placeholder function for DL zip for row called')}
      >
        Download
      </a>
    ),
    disabled: false,
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
