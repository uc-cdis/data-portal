import React, { useState } from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import TableHeaders from './TableHeaders/TableHeaders';
import './DataDictionary.css';
import EntriesHeader from './EntriesHeader/EntriesHeader';

const DataDictionaryContainer = () => {
  const TableDataTotal = TableData.total;
  const [data, setData] = useState(TableData.data);
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

  const rows = data.map((object) => (
    <tr key={object.vocabularyID}>
      <td>{object.vocabularyID}</td>
      <td>{object.conceptId}</td>
      <td>{object.conceptCode}</td>
      <td>{object.conceptName}</td>
      <td>{object.conceptClassId}</td>
      <td>{outputValueAndPercentage(object.numberOfPeopleWithVariable)}</td>
      <td>
        {outputValueAndPercentage(object.numberOfPeopleWhereValueIsFilled)}
      </td>
      <td>{outputValueAndPercentage(object.numberOfPeopleWhereValueIsNull)}</td>
      <td>{object.valueStoredAs}</td>
      <td>{JSON.stringify(object.valueSummary)}</td>
    </tr>
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
    console.log('called handle sort with', sortKey);
    setSortConfig({ sortKey, direction });
    // Perform sorting based on the selected column
    const sortedData = [...data].sort((a, b) => {
      if (direction === 'ascending') {
        return a[sortKey] - b[sortKey];
      } else if (direction === 'descending') {
        return b[sortKey] - a[sortKey];
      }
      return 0;
    });
    setData(sortedData);
  };

  const columnsShown = 10;
  return (
    <div className='dataDictionary'>
      {JSON.stringify(sortConfig)}
      <Table striped>
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
