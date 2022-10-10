import React from 'react';
import PropTypes from 'prop-types';
import '../../GWASUIApp/GWASUIApp.css';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = ({ searchTerm, handleSearch, fields = 'variable name' }) => (
  <div className={'GWASUI-searchContainer'}>
    <div>
      <SearchOutlined />
      <input
        className={'GWASUI-searchInput'}
        type='text'
        placeholder={`Search by ${fields}...`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  </div>
);

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  fields: PropTypes.string.isRequired,
};

export default SearchBar;
