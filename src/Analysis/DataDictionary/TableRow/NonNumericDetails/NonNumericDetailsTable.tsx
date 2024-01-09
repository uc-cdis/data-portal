import React from 'react';
import { Table } from '@mantine/core';
import { IValueSummary } from '../../Interfaces/Interfaces';

const NonNumericDetailsTable = ({
  rowObject,
  checkIfCellContainsSearchTerm,
}) => (
  <Table striped>
    <thead>
      <tr>
        <th>Value as String</th>
        <th>Value as Concept ID</th>
        <th>Concept Name</th>
        <th>Person Count</th>
      </tr>
    </thead>
    <tbody>
      {rowObject.valueSummary.map((valueSummaryObj: IValueSummary) => (
        <tr>
          <td
            className={checkIfCellContainsSearchTerm(
              valueSummaryObj.valueAsString
            )}
          >
            {valueSummaryObj.valueAsString}
          </td>
          <td
            className={checkIfCellContainsSearchTerm(
              valueSummaryObj.valueAsConceptID
            )}
          >
            {valueSummaryObj.valueAsConceptID}
          </td>
          <td className={checkIfCellContainsSearchTerm(valueSummaryObj.name)}>
            {valueSummaryObj.name}
          </td>
          <td
            className={checkIfCellContainsSearchTerm(
              valueSummaryObj.personCount
            )}
          >
            {valueSummaryObj.personCount}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);
export default NonNumericDetailsTable;
