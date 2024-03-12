import React, { useState } from 'react';
import { Button } from '@mantine/core';
import { IValueSummary, IRowData } from '../Interfaces/Interfaces';
import ExpandIcon from '../Icons/ExpandIcon';
import CollapseIcon from '../Icons/CollapseIcon';
import {
  checkIfCellContainsSearchTerm,
  checkIfHiddenCellsContainSearchTerm,
} from './CheckSearchTermUtils';
import ValueSummaryChart from './ValueSummaryChart/ValueSummaryChart';
import TableRowDropdown from './TableRowDropdown/TableRowDropdown';

interface ITableRowProps {
  rowObject: IRowData;
  handleTableChange: Function;
  openDropdowns: number[];
  columnsShown: number;
  searchTerm: string;
}

const TableRow = ({
  rowObject,
  handleTableChange,
  openDropdowns,
  columnsShown,
  searchTerm,
}: ITableRowProps) => {
  // const [showDetails, setShowDetails] = useState(false);
  const currentDropdownShouldBeOpen = openDropdowns.includes(rowObject.rowID);
  return (
    <React.Fragment key={rowObject.rowID}>
      <tr data-testid='table-row'>
        <td>
          {!currentDropdownShouldBeOpen && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => handleTableChange('openDropdown', rowObject.rowID,)}
            >
              <ExpandIcon />
            </Button>
          )}
          {currentDropdownShouldBeOpen && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => handleTableChange('closeDropdown', rowObject.rowID)}
            >
              <CollapseIcon />
            </Button>
          )}
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.vocabularyID,
            searchTerm,
          )}
        >
          <div className={'td-container '}>{rowObject.vocabularyID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptID.toString(),
            searchTerm,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptID}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptCode.toString(),
            searchTerm,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptCode}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptName.toString(),
            searchTerm,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptName}</div>
        </td>
        <td
          className={checkIfCellContainsSearchTerm(
            rowObject.conceptClassID.toString(),
            searchTerm,
          )}
        >
          <div className={'td-container '}>{rowObject.conceptClassID}</div>
        </td>
        <td
          className={
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariable,
              searchTerm,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWithVariablePercent,
              searchTerm,
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
              searchTerm,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilledPercent,
              searchTerm,
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
              searchTerm,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsNullPercent,
              searchTerm,
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
            searchTerm,
          )}
        >
          <div className={'td-container'}>{rowObject.valueStoredAs}</div>
        </td>
        <td
          className={`preview-chart
          ${checkIfHiddenCellsContainSearchTerm(rowObject, searchTerm)}`}
        >
          <div className={'td-container '}>
            <ValueSummaryChart
              chartType={rowObject.valueStoredAs}
              chartData={rowObject.valueSummary as IValueSummary[]}
              preview
            />
          </div>
        </td>
      </tr>
      <TableRowDropdown
        dropdownIsOpen={currentDropdownShouldBeOpen}
        columnsShown={columnsShown}
        rowObject={rowObject}
        searchTerm={searchTerm}
      />
    </React.Fragment>
  );
};

export default TableRow;
