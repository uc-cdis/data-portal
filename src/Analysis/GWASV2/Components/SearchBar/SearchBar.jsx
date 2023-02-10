import React from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import '../../../GWASResults/GWASUIApp.css';

const SearchBar = ({ searchTerm, handleSearch, field = 'variable name' }) => (
  <div data-tour='search-bar' className='GWASUI-searchContainer'>
    <div>
      <input
        className='GWASUI-searchInput'
        type='text'
        placeholder={`Search by ${field}...`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <SearchOutlined />
    </div>
  </div>
);

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default SearchBar;
