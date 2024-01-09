import React from 'react';
import { Table } from '@mantine/core';

const NumericDetailsTable = ({ rowObject, checkIfCellContainsSearchTerm }) => (
  <Table striped>
    <thead>
      <tr>
        <th>Min Value</th>
        <th>Max Value</th>
        <th>Mean Value</th>
        <th>Standard Deviation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className={checkIfCellContainsSearchTerm(rowObject.minValue)}>
          <div className={'td-container'}>{rowObject.minValue}</div>
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.maxValue)}>
          <div className={'td-container'}>{rowObject.maxValue}</div>
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.meanValue)}>
          <div className={'td-container'}>{rowObject.meanValue}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(rowObject.standardDeviation)}
        >
          <div className={'td-container'}>{rowObject.standardDeviation}</div>
        </td>
      </tr>
    </tbody>
  </Table>
);
export default NumericDetailsTable;
