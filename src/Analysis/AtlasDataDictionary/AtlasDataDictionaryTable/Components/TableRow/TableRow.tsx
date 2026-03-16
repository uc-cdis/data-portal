import React from 'react';
import { Button } from '@mantine/core';
import {
  IValueSummary,
  IRowData,
  IColumnManagementData,
} from '../../Interfaces/Interfaces';
import {
  checkIfCellContainsSearchTerm,
  checkIfHiddenCellsContainSearchTerm,
} from '../../Utils/CheckSearchTermUtils';
import ValueSummaryChart from './ValueSummaryChart/ValueSummaryChart';
import TableRowDropdown from './TableRowDropdown/TableRowDropdown';

interface ITableRowProps {
  rowObject: IRowData;
  handleTableChange: Function;
  openDropdowns: number[];
  columnsShown: number;
  searchTerm: string;
  columnManagementData: IColumnManagementData;
}

const TableRow = ({
  rowObject,
  handleTableChange,
  openDropdowns,
  columnsShown,
  searchTerm,
  columnManagementData,
}: ITableRowProps) => {
  const currentDropdownShouldBeOpen = openDropdowns.includes(rowObject.rowID);

  const TdDataCell = ({
    children, columnEnabled, containsSearchTerm, className = '', ...options
  }) => {
    if (!columnEnabled) {
      return (<React.Fragment />);
    }
    if (containsSearchTerm) {
      return (
        <td className={`${className} search-highlight`} {...options}>
          <mark className='td-container'>{children}</mark>
        </td>
      );
    }

    return (
      <td className={className} {...options}>
        <div className='td-container'>{children}</div>
      </td>
    );
  };
  return (
    <React.Fragment key={rowObject.rowID}>
      <tr data-testid='table-row'>
        <td>
          {!currentDropdownShouldBeOpen && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => handleTableChange('openDropdown', rowObject.rowID)}
              aria-label='expand'
            >
              <span className='arrow-icon arrow-icon-right'     data-testid='expand-icon' />
            </Button>
          )}
          {currentDropdownShouldBeOpen && (
            <Button
              variant='subtle'
              size='xs'
              compact
              onClick={() => handleTableChange('closeDropdown', rowObject.rowID)}
              aria-label='collapse'
            >
              <span className='arrow-icon arrow-icon-down' />
            </Button>
          )}
        </td>
        <TdDataCell
          columnEnabled={columnManagementData.vocabularyID}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.vocabularyID,
            searchTerm,
          )}
        >
          {rowObject.vocabularyID}
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.conceptID}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.conceptID.toString(),
            searchTerm,
          )}
        >
          {rowObject.conceptID}
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.conceptCode}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.conceptCode.toString(),
            searchTerm,
          )}
        >
          {rowObject.conceptCode}
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.conceptName}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.conceptName.toString(),
            searchTerm,
          )}
        >
          {rowObject.conceptName}
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.conceptClassID}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.conceptClassID.toString(),
            searchTerm,
          )}
        >
          {rowObject.conceptClassID}
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.numberOfPeopleWithVariable}
          containsSearchTerm={
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
          {rowObject.numberOfPeopleWithVariable.toLocaleString()}
          <br />
          {rowObject.numberOfPeopleWithVariablePercent.toLocaleString()}%
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.numberOfPeopleWhereValueIsFilled}
          containsSearchTerm={
            checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilled,
              searchTerm,
            )
            || checkIfCellContainsSearchTerm(
              rowObject.numberOfPeopleWhereValueIsFilledPercent,
              searchTerm,
            )
          }
        >
          {rowObject.numberOfPeopleWhereValueIsFilled.toLocaleString()}
          <br />
          {rowObject.numberOfPeopleWhereValueIsFilledPercent.toLocaleString()}%
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.numberOfPeopleWhereValueIsNull}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.numberOfPeopleWhereValueIsNull,
            searchTerm,
          )
          || checkIfCellContainsSearchTerm(
            rowObject.numberOfPeopleWhereValueIsNullPercent,
            searchTerm,
          )}
        >
          {rowObject.numberOfPeopleWhereValueIsNull.toLocaleString()}
          <br />
          {rowObject.numberOfPeopleWhereValueIsNullPercent.toLocaleString()}%
        </TdDataCell>
        <TdDataCell
          columnEnabled={columnManagementData.valueStoredAs}
          containsSearchTerm={checkIfCellContainsSearchTerm(
            rowObject.valueStoredAs,
            searchTerm,
          )}
        >
          {rowObject.valueStoredAs}
        </TdDataCell>
        <TdDataCell
          aria-label='value summary preview chart'
          className='preview-chart'
          columnEnabled={columnManagementData.valueSummary}
          containsSearchTerm={checkIfHiddenCellsContainSearchTerm(rowObject, searchTerm)}
        >
          <ValueSummaryChart
            chartType={rowObject.valueStoredAs}
            chartData={rowObject.valueSummary as IValueSummary[]}
            preview
          />
        </TdDataCell>
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
