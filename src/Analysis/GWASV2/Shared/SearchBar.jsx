import React from "react";
import PropTypes from "prop-types";
import "../../GWASUIApp/GWASUIApp.css";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ searchTerm, handleSearch, field = "variable name" }) => (
  <div className={"GWASUI-searchContainer"}>
    <div>
      <input
        className={"GWASUI-searchInput"}
        type="text"
        placeholder={`Search by ${field}...`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <SearchOutlined style={{ fontSize: "20px" }} />
    </div>
  </div>
);

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default SearchBar;
