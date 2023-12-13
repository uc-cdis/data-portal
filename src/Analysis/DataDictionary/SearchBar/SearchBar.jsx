import React, { useEffect, useState } from 'react';
import { Input } from '@mantine/core';
import SearchIcon from '../Icons/SearchIcon';

const SearchBar = ({ TableData, setData }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const filteredData = TableData.filter((item) => {
      let searchQuery = inputValue.toLowerCase().trim();

      // return item.conceptName.toLowerCase().includes(searchQuery);
      return Object.values(item).some((value) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return value.toString().toLowerCase().includes(searchQuery);
        } else if (Array.isArray(value)) {
          console.log('GOT THE ARRAY', value);
          let doesArrayContainsSearchQuery = false;
          value.forEach((arrItem) => {
            Object.values(arrItem).some((arrObjValue) => {
              /* CONSOLE STATEMENTS */
              console.log('arrObjValue ln 20', arrObjValue);
              if (
                typeof arrObjValue === 'string' ||
                typeof arrObjValue === 'number'
              ) {
                console.log(
                  'arrObjValue.toString().toLowerCase().includes(searchQuery)',
                  arrObjValue.toString().toLowerCase().includes(searchQuery)
                );
                /* END CONSOLE STATEMENTS */
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
    console.log(filteredData);
    setData(filteredData);
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ width: '425px', marginBottom: '10px' }}>
      <Input
        icon={<SearchIcon />}
        rightSection={
          inputValue && (
            <span
              style={{
                display: 'block',
                cursor: 'pointer',
                fontSize: '15px',
                width: '15px',
                height: '15px',
                color: '#adb5bd',
                borderRadius: '7px',
                background: '#adb5bd',
                color: 'white',
                lineHeight: '12px',
                textAlign: 'center',
                opacity: '70%',
              }}
              onClick={() => setInputValue('')}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setInputValue('');
                }
              }}
            >
              x
            </span>
          )
        }
        placeholder='Search'
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
