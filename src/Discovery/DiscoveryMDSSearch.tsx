import React from 'react';
import {
  Input,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const DiscoveryMDSSearch = (props: { searchTerm, handleSearchChange}) => (
  <Input
    className='discovery-search'
    prefix={<SearchOutlined />}
    placeholder='Search studies by attribute...'
    value={props.searchTerm}
    onChange={props.handleSearchChange}
    size='large'
    allowClear
  />
);

export default DiscoveryMDSSearch;
