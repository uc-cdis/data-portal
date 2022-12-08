import React from "react";
import PropTypes from "prop-types";
import "../../GWASUIApp/GWASUIApp.css";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ searchTerm, handleSearch, field = "variable name" }) => (
  <div
    style={{
      backgroundColor: "white",
      display: "flex",
      flexDirection: "row",
      borderRadius: 5,
      height: 40
    }}
  >
    <input
      style={{
        border: "none transparent",
        outline: "none",
        fontSize: 14,
        width: 170,
        padding: 7
      }}
      type="text"
      placeholder={`Search by ${field}`}
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
    />
    <SearchOutlined style={{
      fontSize: "20px",
      margin: "auto",
      marginRight: 5
    }} />
  </div>
);

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default SearchBar;
