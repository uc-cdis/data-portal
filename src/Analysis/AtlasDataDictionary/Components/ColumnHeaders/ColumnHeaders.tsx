import React from 'react';
import ColumnsItems from '../../Utils/ColumnItems';
import Header from './Header';
import {
  ISortConfig,
  IColumnManagementData,
} from '../../Interfaces/Interfaces';

interface ITableHeadersProps {
  handleSort: Function;
  sortConfig: ISortConfig;
  columnManagementData: IColumnManagementData;
}

const ColumnHeaders = ({
  handleSort,
  sortConfig,
  columnManagementData,
}: ITableHeadersProps) => (
  <thead className={'column-headers'} data-testid='column-headers'>
    <tr>
      {/* Empty header for dropdown buttons */}
      <Header
        handleSort={handleSort}
        headerJSX={<React.Fragment />}
        headerKey={''}
        sortConfig={sortConfig}
        sortable={false}
      />
      {ColumnsItems.map((item) => (
        <React.Fragment key={item.headerKey}>
          {columnManagementData[item.headerKey] && (
            <Header
              handleSort={handleSort}
              headerJSX={item.jsx}
              headerKey={item.headerKey}
              sortConfig={sortConfig}
              sortable={
                item.headerKey !== 'valueSummary'
              }
            />
          )}
        </React.Fragment>
      ))}
    </tr>
  </thead>
);

export default ColumnHeaders;
