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
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = () => {
  const preprocessedTableData = PreprocessTableData(TableData);
  const [data, setData] = useState(preprocessedTableData);

  const DetermineInitialColumnManagement = () => null;
  const InitialDataDictionaryTableState = {
    openDropdowns: [] as number[],
    searchTerm: '',
    sortConfig: {
      sortKey: null,
      direction: 'off',
    },
    currentPage: 1,
    entriesShown: 10,
    columnsShown: 11,
    columnManagement: DetermineInitialColumnManagement(),
  };
  const [dataDictionaryTableState, setDataDictionaryTableState] = useState(
    InitialDataDictionaryTableState,
  );  const entriesHeaderStart = dataDictionaryTableState.entriesShown
  * dataDictionaryTableState.currentPage
  - dataDictionaryTableState.entriesShown + 1;
const entriesHeaderStop = dataDictionaryTableState.entriesShown
  * dataDictionaryTableState.currentPage;

  const handleTableChange = (
    event:
      | 'openDropdown'
      | 'closeDropdown'
      | 'currentPage'
      | 'entriesShown'
      | 'searchTerm'
      | 'sortConfig'
      | 'columnManagement',
    eventData: any,
  ) => {
    if (event === 'openDropdown') {
      setDataDictionaryTableState({
        ...dataDictionaryTableState,
        openDropdowns: [...dataDictionaryTableState.openDropdowns, eventData],
      });
    } else if (event === 'closeDropdown') {
      setDataDictionaryTableState({
        ...dataDictionaryTableState,
        openDropdowns: dataDictionaryTableState.openDropdowns.filter((dropdownNumber: number) => dropdownNumber !== eventData),
      });
    } else if (event === 'currentPage') {
      setDataDictionaryTableState({
        ...dataDictionaryTableState,
        currentPage: eventData,
      });
    } else if (event === 'entriesShown') {
      setDataDictionaryTableState({
        ...dataDictionaryTableState,
        currentPage: 1,
        entriesShown: eventData,
      });
    } else if (event === 'searchTerm') {
      setDataDictionaryTableState({
        ...dataDictionaryTableState,
        searchTerm: eventData,
        currentPage: 1,
      });
    } else {
      throw new Error(`handleTableChange called with invalid parameters: event:${event}, eventData:${eventData}`);
    }
  };

  const [sortConfig, setSortConfig] = useState<ISortConfig>({
    sortKey: null,
    direction: 'off',
  });

  /* Pagination */
  const paginatedData = data.slice(
    dataDictionaryTableState.entriesShown
      * dataDictionaryTableState.currentPage
      - dataDictionaryTableState.entriesShown,
    dataDictionaryTableState.entriesShown * dataDictionaryTableState.currentPage,
  );

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
    // reset pagination
    handleTableChange('currentPage', 1);
  };

  const rows = paginatedData.map((rowObject, i) => (
    <TableRow
      key={i}
      rowObject={rowObject}
      handleTableChange={handleTableChange}
      openDropdowns={dataDictionaryTableState.openDropdowns}
      columnsShown={dataDictionaryTableState.columnsShown}
      searchTerm={dataDictionaryTableState.searchTerm}
    />
  ));

  return (
    <div
      className='atlas-data-dictionary-container'
      data-testid='atlas-data-dictionary-container'
    >
      <Table>
        <SearchBar
          columnsShown={dataDictionaryTableState.columnsShown}
          TableData={preprocessedTableData}
          setData={setData}
          searchInputValue={dataDictionaryTableState.searchTerm}
          handleTableChange={handleTableChange}
        />
        <ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>
          {rows}
          {!data.length && (
            <tr className='no-data-found'>
              <td colSpan={dataDictionaryTableState.columnsShown}>
                <h2>No Data Found</h2>
              </td>
            </tr>
          )}
        </tbody>
        <EntriesHeader
          start={entriesHeaderStart}
          stop={entriesHeaderStop}
          total={data.length}
          colspan={dataDictionaryTableState.columnsShown}
        />
      </Table>
      <PaginationControls
        entriesShown={dataDictionaryTableState.entriesShown}
        handleTableChange={handleTableChange}
        currentPage={dataDictionaryTableState.currentPage}
        totalEntriesAvailable={data.length}
      />
    </div>
  );
};

export default AtlasDataDictionaryContainer;
