import React, { useEffect, useState } from 'react';
import { Input, Button } from '@mantine/core';
import SearchIcon from '../Icons/SearchIcon';
import { IRowData } from '../Interfaces/Interfaces';

interface ISearchBarProps {
  TableData: IRowData[];
  setData: Function;
  searchInputValue: string;
  setSearchInputValue: Function;
}

const SearchBar = ({
  TableData,
  setData,
  searchInputValue,
  setSearchInputValue,
}: ISearchBarProps) => {
  useEffect(() => {
    const filteredData = TableData.filter((item) => {
      const searchQuery = searchInputValue.toLowerCase().trim();

      // return item.conceptName.toLowerCase().includes(searchQuery);
      return Object.values(item).some((value) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return value.toString().toLowerCase().includes(searchQuery);
        }
        if (Array.isArray(value)) {
          let doesArrayContainsSearchQuery = false;
          value.forEach((arrItem) => {
            Object.values(arrItem).some((arrObjValue) => {
              if (
                typeof arrObjValue === 'string' ||
                typeof arrObjValue === 'number'
              ) {
                if (
                  arrObjValue.toString().toLowerCase().includes(searchQuery)
                ) {
                  doesArrayContainsSearchQuery = true;
                }
              }
            });
          });
          return doesArrayContainsSearchQuery;
        }
      });
    });
    setData(filteredData);
  }, [searchInputValue]);

  const handleInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  return (
    <div className='search-bar'>
      <div className='search-bar-container'>
        <Input
          rightSection={
            searchInputValue ? (
              <button
                className='search-bar-input-control'
                onClick={() => setSearchInputValue('')}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    setSearchInputValue('');
                  }
                }}
              >
                x
              </button>
            ) : (
              <SearchIcon />
            )
          }
          placeholder='Search'
          value={searchInputValue}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
