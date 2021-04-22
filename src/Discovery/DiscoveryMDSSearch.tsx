import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class DiscoveryMDSSearch extends React.Component {
  render() {
    return (
      <Input
        className='discovery-search'
        prefix={<SearchOutlined />}
        placeholder={this.props.config.features.search.searchBar.placeholder}
        value={this.props.searchTerm}
        onChange={this.props.handleSearchChange}
        size='large'
        allowClear
      />
    );
  }
}

DiscoveryMDSSearch.propTypes = {
  config: PropTypes.object,
  searchTerm: PropTypes.string,
  handleSearchChange: PropTypes.func,
};

DiscoveryMDSSearch.defaultProps = {
  config: {},
  searchTerm: '',
  handleSearchChange: () => {},
};

export default DiscoveryMDSSearch;
