import React from 'react';
import TableRowDropdown from './TableRowDropdown';
import TableData from '../../TestData/TableData';
import PreprocessTableData from '../../Utils/PreprocessTableData';
import { IRowData } from '../../Interfaces/Interfaces';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/TableRowDropdown',
  component: 'AtlasDataDictionaryContainer',
};

const processedTableData = PreprocessTableData(TableData);
const firstNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs === 'Number'
);
const firstNonNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs !== 'Number'
);

const MockNumericTemplate = () => (
  <React.Fragment>
    <TableRowDropdown
      showDetails={true}
      columnsShown={11}
      rowObject={firstNumericRow as IRowData}
      searchInputValue={(firstNumericRow as IRowData).conceptName}
    />
  </React.Fragment>
);
const MockNonNumericTemplate = () => (
  <React.Fragment>
    <TableRowDropdown
      showDetails={true}
      columnsShown={11}
      rowObject={firstNonNumericRow as IRowData}
      searchInputValue={(firstNonNumericRow as IRowData).conceptName}
    />
  </React.Fragment>
);

export const MockedNumericRow = MockNumericTemplate.bind({});
export const MockedNonNumericRow = MockNonNumericTemplate.bind({});
