import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableRowDropdown from './TableRowDropdown';
import TableData from '../../../TestData/TableData';
import PreprocessTableData from '../../../Utils/PreprocessTableData';
import { IRowData } from '../../../Interfaces/Interfaces';

const processedTableData = PreprocessTableData(TableData);
const firstNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs === 'Number',
);
const firstNonNumericRow = processedTableData.find(
  (obj) => obj.valueStoredAs !== 'Number',
);

describe('TableRowDropdown', () => {
  const columnsShown = 11;
  it('renders non-numeric details table when valueStoredAs is not Number', () => {
    const { getByTestId } = render(
      <TableRowDropdown
        dropdownIsOpen
        columnsShown={columnsShown}
        rowObject={firstNonNumericRow as IRowData}
        searchTerm=''
      />,
    );
    expect(getByTestId('non-numeric-details-table')).toBeInTheDocument();
  });

  it('renders numeric details table when valueStoredAs is Number', () => {
    const { getByTestId } = render(
      <TableRowDropdown
        dropdownIsOpen
        columnsShown={columnsShown}
        rowObject={firstNumericRow as IRowData}
        searchTerm=''
      />,
    );
    expect(getByTestId('numeric-details-table')).toBeInTheDocument();
  });

  it('renders value summary chart ', () => {
    const { getByTestId } = render(
      <TableRowDropdown
        dropdownIsOpen
        columnsShown={columnsShown}
        rowObject={firstNumericRow as IRowData}
        searchTerm=''
      />,
    );
    expect(getByTestId('value-summary-chart')).toBeInTheDocument();
  });
});
