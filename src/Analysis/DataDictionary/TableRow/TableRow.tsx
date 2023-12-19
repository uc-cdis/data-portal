import React, { useState } from 'react';
import { Button, SimpleGrid } from '@mantine/core';
import { IRowData, IValueSummary } from '../Interfaces/Interfaces';

interface ITableRowProps {
  TableDataTotal: number;
  rowObject: IRowData;
  columnsShown: number;
  searchInputValue: string;
}

const TableRow = ({
  TableDataTotal,
  rowObject,
  columnsShown,
  searchInputValue,
}: ITableRowProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const outputValueAndPercentage = (value) => (
    <React.Fragment>
      {value}
      <br />
      {Math.trunc((value / TableDataTotal) * 100 * 100) / 100}%
    </React.Fragment>
  );

  const checkIfCellContainsSearchTerm = (cellText: string | number | null) => {
    if (
      searchInputValue &&
      cellText &&
      cellText
        .toString()
        .toLowerCase()
        .includes(searchInputValue.toLowerCase().trim())
    ) {
      return 'search-highlight';
    }
    return '';
  };

  const checkIfDetailTableContainsSearchTerm = (rowObject: IRowData) => {
    let searchTermFound = false;
    const hiddenKeys = [
      'minValue',
      'maxValue',
      'meanValue',
      'standardDeviation',
    ];
    hiddenKeys.forEach((keyString) => {
      if (checkIfCellContainsSearchTerm(rowObject[keyString])) {
        searchTermFound = true;
      }
    });
    if (searchTermFound) return 'search-highlight';
    return '';
  };
  const checkIfChartContainsSearchTerm = (rowObject: IRowData) => {
    let searchTermFound = false;
    rowObject.valueSummary.forEach((arrObj) => {
      Object.values(arrObj).forEach((arrObjVal) => {
        if (checkIfCellContainsSearchTerm(arrObjVal)) {
          searchTermFound = true;
        }
      });
    });
    if (searchTermFound) return 'search-highlight';
    return '';
  };

  const checkIfHiddenCellsContainSearchTerm = (rowObject: IRowData) => {
    if (checkIfDetailTableContainsSearchTerm(rowObject))
      return 'search-highlight';
    if (checkIfChartContainsSearchTerm(rowObject)) return 'search-highlight';
    return '';
  };

  return (
    <React.Fragment key={rowObject.vocabularyID}>
      <tr>
        <td>
          {!showDetails && (
            <Button variant='subtle' onClick={() => setShowDetails(true)}>
              <strong>〉</strong>
            </Button>
          )}
          {showDetails && (
            <Button variant='subtle' onClick={() => setShowDetails(false)}>
              <strong>&#xfe40;</strong>
            </Button>
          )}
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.vocabularyID)}>
          {rowObject.vocabularyID}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptID.toString()
          )}
        >
          {rowObject.conceptID}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptCode.toString()
          )}
        >
          {rowObject.conceptCode}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptName.toString()
          )}
        >
          {rowObject.conceptName}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptClassID.toString()
          )}
        >
          {rowObject.conceptClassID}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.numberOfPeopleWithVariable
          )}
        >
          {outputValueAndPercentage(rowObject.numberOfPeopleWithVariable)}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.numberOfPeopleWhereValueIsFilled
          )}
        >
          {outputValueAndPercentage(rowObject.numberOfPeopleWhereValueIsFilled)}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.numberOfPeopleWhereValueIsNull
          )}
        >
          {outputValueAndPercentage(rowObject.numberOfPeopleWhereValueIsNull)}
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.valueStoredAs)}>
          {rowObject.valueStoredAs}
        </td>
        <td className={checkIfHiddenCellsContainSearchTerm(rowObject)}>
          {JSON.stringify(rowObject.valueSummary)}
        </td>
      </tr>
      <tr className={`expandable ${showDetails ? 'expanded' : ''}`}>
        <td colSpan={columnsShown}>
          <div className={`expandable ${showDetails ? 'expanded' : ''}`}>
            <SimpleGrid cols={2}>
              <div
                style={{ marginLeft: '1em', padding: '1em' }}
                className={checkIfChartContainsSearchTerm(rowObject)}
              >
                <h3>Value Summary</h3>
                {JSON.stringify(rowObject.valueSummary)}
                <br />
              </div>
              <div
                style={{
                  marginRight: '1em',
                  padding: '1em',
                  borderLeft: '2px solid navy',
                }}
                className={checkIfDetailTableContainsSearchTerm(rowObject)}
              >
                <h3>Additional Data</h3>
                <br />
                minValue: {rowObject.minValue}
                <br />
                maxValue: {rowObject.maxValue}
                <br />
                meanValue: {rowObject.meanValue}
                <br />
                standardDeviation: {rowObject.standardDeviation}
              </div>
            </SimpleGrid>
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default TableRow;
