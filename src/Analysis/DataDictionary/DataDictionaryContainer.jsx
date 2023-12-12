import React, { useState } from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import TableHeaders from './TableHeaders/TableHeaders';
import './DataDictionary.css';
import EntriesHeader from './EntriesHeader/EntriesHeader';

const DataDictionaryContainer = () => {
  const TableDataTotal = TableData.total;
  const [data, setData] = useState(TableData.data);
  const columnsShown = 10;
  const [sortConfig, setSortConfig] = useState({
    sortKey: null,
    direction: 'off',
  });

  const outputValueAndPercentage = (value) => (
    <React.Fragment>
      {value}
      <br />
      {Math.trunc((value / TableDataTotal) * 100 * 100) / 100}%
    </React.Fragment>
  );

  const rows = data.map((object, i) => (
    <React.Fragment key={object.vocabularyID}>
      <tr colSpan={columnsShown}>
        <td>{object.vocabularyID}</td>
        <td>{object.conceptID}</td>
        <td>{object.conceptCode}</td>
        <td>{object.conceptName}</td>
        <td>{object.conceptClassID}</td>
        <td>{outputValueAndPercentage(object.numberOfPeopleWithVariable)}</td>
        <td>
          {outputValueAndPercentage(object.numberOfPeopleWhereValueIsFilled)}
        </td>
        <td>
          {outputValueAndPercentage(object.numberOfPeopleWhereValueIsNull)}
        </td>
        <td>{object.valueStoredAs}</td>
        <td>{JSON.stringify(object.valueSummary)}</td>
      </tr>
      <tr>
        <td colSpan={columnsShown} style={{ background: 'green' }}>
          Long Column!!! {object.vocabularyID}
        </td>
      </tr>
    </React.Fragment>
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
    // Perform sorting based on the selected column

    const sortedData = [...data].sort((a, b) => {
      console.log('a[sortKey]', a[sortKey]);
      if (direction === 'ascending') {
        return a[sortKey].toString().localeCompare(b[sortKey].toString());
      }
      if (direction === 'descending') {
        return b[sortKey].toString().localeCompare(a[sortKey].toString());
      }
      return 0;
    });
    // if column is set to off reset to initial
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
      <Table>
        <EntriesHeader
          start={1}
          stop={TableData.data.length}
          total={TableData.data.length}
          colspan={columnsShown}
          position='top'
        />
        <TableHeaders handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>{rows}</tbody>
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
