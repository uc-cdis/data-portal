import React from 'react';
import { Table } from '@mantine/core';
import { checkIfCellContainsSearchTerm } from '../../../Utils/CheckSearchTermUtils';

const NumericDetailsTable = ({ rowObject, searchTerm }) => (
  <Table data-testid='numeric-details-table' striped>
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
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.minValue,
            searchTerm,
          )}
        >
          <div className={'td-container'}>{rowObject.minValue.toLocaleString()}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.maxValue,
            searchTerm,
          )}
        >
          <div className={'td-container'}>{rowObject.maxValue.toLocaleString()}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.meanValue,
            searchTerm,
          )}
        >
          <div className={'td-container'}>{rowObject.meanValue.toLocaleString()}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.standardDeviation,
            searchTerm,
          )}
        >
          <div className={'td-container'}>{rowObject.standardDeviation.toLocaleString()}</div>
        </td>
      </tr>
    </tbody>
  </Table>
);
export default NumericDetailsTable;
