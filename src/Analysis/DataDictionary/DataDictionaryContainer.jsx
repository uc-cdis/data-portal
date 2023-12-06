import React from 'react';
import { Table } from '@mantine/core';
import TableData from './TestData/TableData';
import './DataDictionary.css';

const TableDataTotal = TableData.total;

const outputValueAndPercentage = (value) => (
  <>
    {value}
    <br />
    {Math.trunc((value / TableDataTotal) * 100 * 100) / 100}%
  </>
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
    <td>{object.minValue}</td>
    <td>{object.maxValue}</td>
    <td>{object.meanValue}</td>
    <td>{object.standardDeviation}</td>
    <td>{JSON.stringify(object.valueSummary)}</td>
  </tr>
));

const DataDictionaryContainer = () => (
  <div className='dataDictionary'>
    <Table striped>
      <thead>
        <tr>
          <th>Vocabulary&nbsp;ID</th>
          <th>Concept&nbsp;ID</th>
          <th>Concept&nbsp;Code</th>
          <th>Concept&nbsp;Name</th>
          <th>Concept&nbsp;Class&nbsp;ID</th>
          <th>
            #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
            <br />
            with&nbsp;Variable
          </th>
          <th>
            #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
            <br />
            where&nbsp;Value&nbsp;is&nbsp;Filled
          </th>
          <th>
            #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
            <br />
            where&nbsp;Value&nbsp;is&nbsp;Null
          </th>
          <th>Value&nbsp;Stored&nbsp;As</th>
          <th>Min&nbsp;Value</th>
          <th>Max&nbsp;Value</th>
          <th>Mean&nbsp;Value</th>
          <th>
            Standard
            <br />
            Deviation
          </th>
          <th>Value&nbsp;Summary</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  </div>
);

export default DataDictionaryContainer;
