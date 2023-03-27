import React from 'react';
import { Space, Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: (
      <a
        href=''
        onClick={(e) => {
          e.preventDefault();
          alert('Placeholder function for downloading row zip file called');
        }}
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
