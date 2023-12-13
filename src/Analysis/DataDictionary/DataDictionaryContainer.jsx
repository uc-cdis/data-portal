import React, { useState } from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import TableHeaders from './TableHeaders/TableHeaders';
import './DataDictionary.css';
import EntriesHeader from './EntriesHeader/EntriesHeader';
import SearchBar from './SearchBar/SearchBar';
import TableRow from './TableRow/TableRow';

const DataDictionaryContainer = () => {
  const TableDataTotal = TableData.total;
  const [data, setData] = useState(TableData.data);
  const [searchInputValue, setSearchInputValue] = useState('');
  const columnsShown = 10;
  const [sortConfig, setSortConfig] = useState({
    sortKey: null,
    direction: 'off',
  });

  const rows = data.map((rowObject, i) => (
    <TableRow
      TableDataTotal={TableDataTotal}
      rowObject={rowObject}
      columnsShown={columnsShown}
      searchInputValue={searchInputValue}
    />
  ));

  const handleSort = (sortKey) => {
    let direction = 'ascending';
    if (sortConfig.sortKey === sortKey) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'off';
      } else if (sortConfig.direction === 'off') {
        direction = 'ascending';
      }
    }
    setSortConfig({ sortKey, direction });

    const sortedData = [...data].sort((a, b) => {
      if (direction === 'ascending') {
        return a[sortKey].toString().localeCompare(b[sortKey].toString());
      }
      if (direction === 'descending') {
        return b[sortKey].toString().localeCompare(a[sortKey].toString());
      }
      return 0;
    });
    // if column is set to off reset to initial sort
    if (direction === 'off') {
      setData(TableData.data);
    }
    // Otherwise set with sortedData
    else {
      setData(sortedData);
    }
  };

  return (
    <div className='dataDictionary'>
      {JSON.stringify(sortConfig)}
      <SearchBar
        TableData={TableData.data}
        setData={setData}
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
      />
      <Table>
        <EntriesHeader
          start={1}
          stop={TableData.data.length}
          total={TableData.data.length}
          colspan={columnsShown}
          position='top'
        />
        <TableHeaders handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>
          {rows}
          {!data.length && (
            <tr style={{ textAlign: 'center' }}>
              <td colSpan={columnsShown}>
                <h2>No Data Found</h2>
              </td>
            </tr>
          )}
        </tbody>
        <EntriesHeader
          start={1}
          stop={TableData.data.length}
          total={TableData.data.length}
          colspan={columnsShown}
          position='bottom'
        />
      </Table>
    </div>
  );
};

export default DataDictionaryContainer;
