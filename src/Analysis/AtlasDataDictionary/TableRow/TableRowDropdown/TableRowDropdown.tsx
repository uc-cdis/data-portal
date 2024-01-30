import React from 'react';
import { Grid } from '@mantine/core';
import NonNumericDetailsTable from '../NonNumericDetails/NonNumericDetailsTable';
import NumericDetailsTable from '../NumericDetails/NumericDetailsTable';
import { checkIfChartContainsSearchTerm } from '../CheckSearchTermUtils';
import ValueSummaryChart from '../ValueSummaryChart/ValueSummaryChart';
import { IRowData } from '../../Interfaces/Interfaces';

interface ITableRowDropdownProps {
  showDetails: boolean;
  columnsShown: number;
  rowObject: IRowData;
  searchInputValue: string;
}

const TableRowDropdown = ({
  showDetails,
  columnsShown,
  rowObject,
  searchInputValue,
}: ITableRowDropdownProps) => (
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
              className={`expanded-container chart-details-wrapper
              ${checkIfChartContainsSearchTerm(rowObject, searchInputValue)}`}
            >
              <ValueSummaryChart
                chartData={rowObject.valueSummary}
                preview={false}
                chartType={rowObject.valueStoredAs}
              />
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </td>
  </tr>
);

export default TableRowDropdown;
