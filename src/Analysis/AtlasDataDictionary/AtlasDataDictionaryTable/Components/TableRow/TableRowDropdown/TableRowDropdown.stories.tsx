import React from 'react';
import TableRowDropdown from './TableRowDropdown';
import TableData from '../../../TestData/TableData';
import PreprocessTableData from '../../../Utils/PreprocessTableData';
import { IRowData } from '../../../Interfaces/Interfaces';
import '../../../../AtlasDataDictionary.css';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/TableRowDropdown',
  component: 'AtlasDataDictionaryContainer',
};

const processedTableData = PreprocessTableData(TableData);
const firstNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs === 'Number',
);
const firstNonNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs !== 'Number',
);

const defaultArgs = {
  showDetails: true,
  columnsShown: 11,
  rowObject: firstNonNumericRow as IRowData,
  searchTerm: (firstNonNumericRow as IRowData).conceptName,
  dropdownIsOpen: true,
};

const NonNumericTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <TableRowDropdown {...defaultArgs} />
  </div>
);
const NumericTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <table>
      <TableRowDropdown
        {...{ ...defaultArgs, rowObject: firstNumericRow as IRowData }}
      />
    </table>
  </div>
);

export const NonNumericDropdown = NonNumericTemplate.bind({});
export const NumericDropdown = NumericTemplate.bind({});
