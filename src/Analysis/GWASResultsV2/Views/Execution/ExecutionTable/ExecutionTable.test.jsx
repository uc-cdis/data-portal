import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionTable from './ExecutionTable';
import SharedContext from '../../../Utils/SharedContext';
import TableData from '../../../TestData/TableData';

describe('ExecutionTable', () => {
  it('renders the selected row data correctly', () => {
    const selectedRowData = TableData[0];
    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <ExecutionTable />
      </SharedContext.Provider>
    );
    expect(screen.getByText(selectedRowData.name)).toBeInTheDocument();
    expect(screen.getByText(selectedRowData.wf_name)).toBeInTheDocument();
    expect(screen.getByText(selectedRowData.startedAt)).toBeInTheDocument();
    expect(screen.getByText(selectedRowData.phase)).toBeInTheDocument();
  });
});
