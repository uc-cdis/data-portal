import React, { useState } from 'react';
import { Button, Grid, Table } from '@mantine/core';
import { IRowData } from '../Interfaces/Interfaces';

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

  const checkIfCellContainsSearchTerm = (
    cellText: string | number | null | undefined
  ) => {
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

  const checkIfDetailTableContainsSearchTerm = () => {
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
  const checkIfChartContainsSearchTerm = () => {
    let searchTermFound = false;
    rowObject.valueSummary.forEach((arrObj) => {
      Object.values(arrObj).forEach((arrObjVal) => {
        if (checkIfCellContainsSearchTerm(arrObjVal)) {
          console.log('FOUND!');
          searchTermFound = true;
        }
      });
    });
    if (searchTermFound) {
      console.log(searchTermFound, searchInputValue);
      return 'search-highlight';
    }
    return '';
  };

  const checkIfHiddenCellsContainSearchTerm = () => {
    if (checkIfDetailTableContainsSearchTerm()) return 'search-highlight';
    if (checkIfChartContainsSearchTerm()) return 'search-highlight';
    return '';
  };

  console.log('rowObject', rowObject);
  return (
    <React.Fragment key={rowObject.vocabularyID}>
      <tr>
        <td>
          {!showDetails && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => setShowDetails(true)}
            >
              <strong>〉</strong>
            </Button>
          )}
          {showDetails && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => setShowDetails(false)}
            >
              <strong>&#xfe40;</strong>
            </Button>
          )}
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.vocabularyID)}>
          <div className={'td-container '}>{rowObject.vocabularyID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptID.toString()
          )}
        >
          <div className={'td-container '}>{rowObject.conceptID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptCode.toString()
          )}
        >
          <div className={'td-container '}>{rowObject.conceptCode}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptName.toString()
          )}
        >
          <div className={'td-container '}>{rowObject.conceptName}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptClassID.toString()
          )}
        >
          <div className={'td-container '}>{rowObject.conceptClassID}</div>
        </td>
        <td
          className={
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariable
            ) ||
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariablePercent
            )
          }
        >
          <div className={'td-container'}>
            {rowObject.numberOfPeopleWithVariable}
            <br />
            {rowObject.numberOfPeopleWithVariablePercent}%
          </div>
        </td>
        <td
          className={`${
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilled
            ) ||
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilledPercent
            )
          } `}
        >
          <div className={'td-container'}>
            {rowObject.numberOfPeopleWhereValueIsFilled}
            <br />
            {rowObject.numberOfPeopleWhereValueIsFilledPercent}%
          </div>
        </td>
        <td
          className={
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsNull
            ) ||
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsNullPercent
            )
          }
        >
          <div className={'td-container '}>
            {rowObject.numberOfPeopleWhereValueIsNull}
            <br />
            {rowObject.numberOfPeopleWhereValueIsNullPercent}%
          </div>
        </td>
        <td className={checkIfCellContainsSearchTerm(rowObject.valueStoredAs)}>
          <div className={'td-container'}>{rowObject.valueStoredAs}</div>
        </td>
        <td className={checkIfHiddenCellsContainSearchTerm()}>
          <div className={'td-container '}>
            {JSON.stringify(rowObject.valueSummary)}
          </div>
        </td>
      </tr>
      <tr className={`expandable ${showDetails ? 'expanded' : ''}`}>
        <td colSpan={columnsShown}>
          <div className={`expandable ${showDetails ? 'expanded' : ''}`}>
            <Grid>
              <Grid.Col span={5}>
                <div className={'expanded-container'}>
                  <h3>Data Viz Info</h3>
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
                      <tr>
                        <td>Value as String</td>
                        <td>Value as Concept ID</td>
                        <td>Concept Name</td>
                        <td>Person Count</td>
                      </tr>
                    </tbody>
                  </Table>
                  <h3>Additional Info</h3>
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
                        <td
                          className={checkIfCellContainsSearchTerm(
                            rowObject.minValue
                          )}
                        >
                          <div className={'td-container'}>
                            {rowObject.minValue}
                          </div>
                        </td>
                        <td
                          className={checkIfCellContainsSearchTerm(
                            rowObject.maxValue
                          )}
                        >
                          <div className={'td-container'}>
                            {rowObject.maxValue}
                          </div>
                        </td>
                        <td
                          className={checkIfCellContainsSearchTerm(
                            rowObject.meanValue
                          )}
                        >
                          <div className={'td-container'}>
                            {rowObject.meanValue}
                          </div>
                        </td>
                        <td
                          className={checkIfCellContainsSearchTerm(
                            rowObject.standardDeviation
                          )}
                        >
                          <div className={'td-container'}>
                            {rowObject.standardDeviation}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Grid.Col>
              <Grid.Col span={7}>
                <div
                  className={`expanded-container chart-details-wrapper ${checkIfChartContainsSearchTerm()}`}
                >
                  <h3>Value Summary</h3>
                  {JSON.stringify(rowObject.valueSummary)}
                  <br />
                </div>
              </Grid.Col>
            </Grid>
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default TableRow;
