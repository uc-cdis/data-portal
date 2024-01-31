import React from 'react';
import { Table } from '@mantine/core';
import { checkIfCellContainsSearchTerm } from '../CheckSearchTermUtils';

const NumericDetailsTable = ({ rowObject, searchInputValue }) => (
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
            searchInputValue,
          )}
        >
          <div className={'td-container'}>{rowObject.minValue}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.maxValue,
            searchInputValue,
          )}
        >
          <div className={'td-container'}>{rowObject.maxValue}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.meanValue,
            searchInputValue,
          )}
        >
          <div className={'td-container'}>{rowObject.meanValue}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.standardDeviation,
            searchInputValue,
          )}
        >
          <div className={'td-container'}>{rowObject.standardDeviation}</div>
        </td>
      </tr>
    </tbody>
  </Table>
);
export default NumericDetailsTable;
