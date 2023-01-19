import React from 'react';
import {
  Input,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const DiscoveryMDSSearch = (props: { searchTerm, handleSearchChange, inputSubtitle}) => (
  <React.Fragment>
    <Input
      className='discovery-search'
      prefix={<SearchOutlined />}
      placeholder='Search studies by keyword...'
      value={props.searchTerm}
      onChange={props.handleSearchChange}
      size='large'
      allowClear
    />
    <div className='discovery-input-subtitle'>{props.inputSubtitle}</div>
  </React.Fragment>
);

export default DiscoveryMDSSearch;
