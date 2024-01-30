import React from 'react';
import { Table } from '@mantine/core';
import { IValueSummary } from '../../Interfaces/Interfaces';
import { checkIfCellContainsSearchTerm } from '../CheckSearchTermUtils';

const NonNumericDetailsTable = ({ rowObject, searchInputValue }) => (
  <Table data-testid='non-numeric-details-table' striped>
    <thead>
      <tr>
        <th>Value as String</th>
        <th>Value as Concept ID</th>
        <th>Concept Name</th>
        <th>Person Count</th>
      </tr>
    </thead>
    <tbody>
      {rowObject.valueSummary.map(
        (valueSummaryObj: IValueSummary, i: number) => (
          <tr key={i}>
            <td
              className={checkIfCellContainsSearchTerm(
                valueSummaryObj.valueAsString,
                searchInputValue
              )}
            >
              {valueSummaryObj.valueAsString}
            </td>
            <td
              className={checkIfCellContainsSearchTerm(
                valueSummaryObj.valueAsConceptID,
                searchInputValue
              )}
            >
              {valueSummaryObj.valueAsConceptID}
            </td>
            <td
              className={checkIfCellContainsSearchTerm(
                valueSummaryObj.name,
                searchInputValue
              )}
            >
              {valueSummaryObj.name}
            </td>
            <td
              className={checkIfCellContainsSearchTerm(
                valueSummaryObj.personCount,
                searchInputValue
              )}
            >
              {valueSummaryObj.personCount}
            </td>
          </tr>
        )
      )}
    </tbody>
  </Table>
);
export default NonNumericDetailsTable;
