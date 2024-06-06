import React from 'react';
import { Grid } from '@mantine/core';
import NonNumericDetailsTable from '../NonNumericDetailsTable/NonNumericDetailsTable';
import NumericDetailsTable from '../NumericDetailsTable/NumericDetailsTable';
import { checkIfChartContainsSearchTerm } from '../../../Utils/CheckSearchTermUtils';
import ValueSummaryChart from '../ValueSummaryChart/ValueSummaryChart';
import { IRowData } from '../../../Interfaces/Interfaces';

interface ITableRowDropdownProps {
  dropdownIsOpen: boolean;
  columnsShown: number;
  rowObject: IRowData;
  searchTerm: string;
}

const TableRowDropdown = ({
  dropdownIsOpen,
  columnsShown,
  rowObject,
  searchTerm,
}: ITableRowDropdownProps) => {
  const gridColSpanForTable = 5;
  const gridColSpanForChart = 7;
  return (
    <tr className={`expandable ${dropdownIsOpen && 'expanded'}`}>
      <td colSpan={columnsShown}>
        <div className={`expandable ${dropdownIsOpen && 'expanded'}`}>
          <Grid>
            <Grid.Col span={gridColSpanForTable}>
              <div className={'expanded-container'}>
                {rowObject.valueStoredAs !== 'Number' && (
                  <NonNumericDetailsTable
                    rowObject={rowObject}
                    searchTerm={searchTerm}
                  />
                )}
                {rowObject.valueStoredAs === 'Number' && (
                  <NumericDetailsTable
                    rowObject={rowObject}
                    searchTerm={searchTerm}
                  />
                )}
              </div>
            </Grid.Col>
            <Grid.Col span={gridColSpanForChart}>
              <div
                className={`expanded-container chart-details-wrapper
                ${checkIfChartContainsSearchTerm(rowObject, searchTerm)}`}
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
};

export default TableRowDropdown;
