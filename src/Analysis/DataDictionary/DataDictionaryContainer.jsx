import React from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import TableHeaders from './TableHeaders/TableHeaders';
import './DataDictionary.css';

const TableDataTotal = TableData.total;

const outputValueAndPercentage = (value) => (
  <React.Fragment>
    {value}
    <br />
    {Math.trunc((value / TableDataTotal) * 100 * 100) / 100}%
  </React.Fragment>
);

const rows = TableData.data.map((object) => (
  <tr key={object.vocabularyID}>
    <td>{object.vocabularyID}</td>
    <td>{object.conceptId}</td>
    <td>{object.conceptCode}</td>
    <td>{object.conceptName}</td>
    <td>{object.conceptClassId}</td>
    <td>{outputValueAndPercentage(object.numberOfPeopleWithVariable)}</td>
    <td>{outputValueAndPercentage(object.numberOfPeopleWhereValueIsFilled)}</td>
    <td>{outputValueAndPercentage(object.numberOfPeopleWhereValueIsNull)}</td>
    <td>{object.valueStoredAs}</td>
    <td>{JSON.stringify(object.valueSummary)}</td>
  </tr>
));

const DataDictionaryContainer = () => (
  <div className='dataDictionary'>
    <Table striped>
      <TableHeaders />
      <tbody>{rows}</tbody>
    </Table>
  </div>
);

export default DataDictionaryContainer;
