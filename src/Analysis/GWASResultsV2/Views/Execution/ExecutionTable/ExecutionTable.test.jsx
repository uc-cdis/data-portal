import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionTable from './ExecutionTable';
import SharedContext from '../../../Utils/SharedContext';
import TableData from '../../../TestData/TableData';

describe('ExecutionTable', () => {
  it('renders the selected row data correctly', () => {
    const selectedRowData = TableData[0];
    const { getByText } = render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <ExecutionTable />
      </SharedContext.Provider>,
    );
    expect(getByText(selectedRowData.name)).toBeInTheDocument();
    expect(getByText(selectedRowData.uid)).toBeInTheDocument();
    expect(getByText(selectedRowData.startedAt)).toBeInTheDocument();
    expect(getByText(selectedRowData.phase)).toBeInTheDocument();
  });
});
