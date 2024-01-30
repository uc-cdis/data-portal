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

console.log('firstNonNumericRow', firstNonNumericRow);

let defaultArgs = {
  showDetails: true,
  columnsShown: 11,
  rowObject: firstNonNumericRow as IRowData,
  searchInputValue: (firstNonNumericRow as IRowData).conceptName,
};

const NonNumericTemplate = () => (
  <React.Fragment>
    <TableRowDropdown {...defaultArgs} />
  </React.Fragment>
);
const NumericTemplate = () => (
  <React.Fragment>
    <TableRowDropdown
      {...{ ...defaultArgs, rowObject: firstNumericRow as IRowData }}
    />
  </React.Fragment>
);

export const NonNumericDropdown = NonNumericTemplate.bind({});
export const NumericDropdown = NumericTemplate.bind({});
