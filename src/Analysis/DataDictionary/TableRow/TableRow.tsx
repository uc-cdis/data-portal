import React, { useState } from 'react';
import { Button, Grid } from '@mantine/core';
import { IRowData } from '../Interfaces/Interfaces';
import ExpandIcon from '../Icons/ExpandIcon';
import CollapseIcon from '../Icons/CollapseIcon';
import PreviewChart from './PreviewChart/PreviewChart';
import NumericDetailsTable from './NumericDetails/NumericDetailsTable';
import NonNumericDetailsTable from './NonNumericDetails/NonNumericDetailsTable';
import { checkIfCellContainsSearchTerm } from './CheckSearchTermUtils';

interface ITableRowProps {
  rowObject: IRowData;
  columnsShown: number;
  searchInputValue: string;
}

const TableRow = ({
  rowObject,
  columnsShown,
  searchInputValue,
}: ITableRowProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const checkIfDetailTableContainsSearchTerm = () => {
    let searchTermFound = false;
    const hiddenKeys = [
      'minValue',
      'maxValue',
      'meanValue',
      'standardDeviation',
    ];
    hiddenKeys.forEach((keyString) => {
      if (
        checkIfCellContainsSearchTerm(rowObject[keyString], searchInputValue)
      ) {
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
        if (checkIfCellContainsSearchTerm(arrObjVal, searchInputValue)) {
          searchTermFound = true;
        }
      });
    });
    if (searchTermFound) {
      return 'search-highlight';
    }
    return '';
  };

  const checkIfHiddenCellsContainSearchTerm = () => {
    if (checkIfDetailTableContainsSearchTerm()) return 'search-highlight';
    if (checkIfChartContainsSearchTerm()) return 'search-highlight';
    return '';
  };

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
              <ExpandIcon />
            </Button>
          )}
          {showDetails && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => setShowDetails(false)}
            >
              <CollapseIcon />
            </Button>
          )}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.vocabularyID,
            searchInputValue,
          )}
        >
          <div className={'td-container '}>{rowObject.vocabularyID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptID.toString(),
            searchInputValue,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptCode.toString(),
            searchInputValue,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptCode}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptName.toString(),
            searchInputValue,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptName}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptClassID.toString(),
            searchInputValue,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptClassID}</div>
        </td>
        <td
          className={
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariable,
              searchInputValue,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariablePercent,
              searchInputValue,
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
              rowObject.numberOfPeopleWhereValueIsFilled,
              searchInputValue,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilledPercent,
              searchInputValue,
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
              rowObject.numberOfPeopleWhereValueIsNull,
              searchInputValue,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsNullPercent,
              searchInputValue,
            )
          }
        >
          <div className={'td-container '}>
            {rowObject.numberOfPeopleWhereValueIsNull}
            <br />
            {rowObject.numberOfPeopleWhereValueIsNullPercent}%
          </div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.valueStoredAs,
            searchInputValue,
          )}
        >
          <div className={'td-container'}>{rowObject.valueStoredAs}</div>
        </td>
        <td
          className={`preview-chart ${checkIfHiddenCellsContainSearchTerm()}`}
        >
          <div className={'td-container '}>
            <PreviewChart />
          </div>
        </td>
      </tr>
      <tr className={`expandable ${showDetails ? 'expanded' : ''}`}>
        <td colSpan={columnsShown}>
          <div className={`expandable ${showDetails ? 'expanded' : ''}`}>
            <Grid>
              <Grid.Col span={5}>
                <div className={'expanded-container'}>
                  {rowObject.valueStoredAs !== 'Number' && (
                    <NonNumericDetailsTable
                      rowObject={rowObject}
                      searchInputValue={searchInputValue}
                    />
                  )}
                  {rowObject.valueStoredAs === 'Number' && (
                    <NumericDetailsTable
                      rowObject={rowObject}
                      searchInputValue={searchInputValue}
                    />
                  )}
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
