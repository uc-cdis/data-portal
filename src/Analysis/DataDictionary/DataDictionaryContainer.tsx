import React, { useState } from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import ColumnHeaders from './ColumnHeaders/ColumnHeaders';
import EntriesHeader from './EntriesHeader/EntriesHeader';
import SearchBar from './SearchBar/SearchBar';
import TableRow from './TableRow/TableRow';
import PaginationControls from './PaginationControls/PaginationControls';
import { ISortConfig } from './Interfaces/Interfaces';
import PreprocessTableData from './Utils/PreprocessTableData';
import './DataDictionary.css';

const DataDictionaryContainer = () => {
  const preprocessedTableData = PreprocessTableData(TableData);
  const [data, setData] = useState(preprocessedTableData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const columnsShown = 11;
  const [sortConfig, setSortConfig] = useState<ISortConfig>({
    sortKey: null,
    direction: 'off',
  });

  /* Pagination */
  const [entriesShown, setEntriesShown] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const paginatedData = data.slice(
    entriesShown * activePage - entriesShown,
    entriesShown * activePage,
  );

  const rows = paginatedData.map((rowObject, i) => (
    <TableRow
      key={i}
      rowObject={rowObject}
      columnsShown={columnsShown}
      searchInputValue={searchInputValue}
    />
  ));

  const handleSort = (sortKey) => {
    let direction: ISortConfig['direction'] = 'ascending';
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
      setData(preprocessedTableData);
    } else {
      // Otherwise set with sortedData
      setData(sortedData);
    }
  };

  return (
    <div
      className='data-dictionary-container'
      data-testid='data-dictionary-container'
    >
      <Table>
        <SearchBar
          columnsShown={columnsShown}
          TableData={preprocessedTableData}
          setData={setData}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
        />
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>
          {rows}
          {!data.length && (
            <tr className='no-data-found'>
              <td colSpan={columnsShown}>
                <h2>No Data Found</h2>
              </td>
            </tr>
          )}
        </tbody>
        <EntriesHeader
          start={entriesShown * activePage - entriesShown}
          stop={entriesShown * activePage}
          total={data.length}
          colspan={columnsShown}
        />
      </Table>
      <PaginationControls
        entriesShown={entriesShown}
        setEntriesShown={setEntriesShown}
        activePage={activePage}
        setActivePage={setActivePage}
        totalEntriesAvailable={data.length}
      />
    </div>
  );
};

export default DataDictionaryContainer;
