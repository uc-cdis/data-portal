import React, { useContext, useState } from 'react';
import SharedContext from '../../Utils/SharedContext';

const ExecutionTable = () => {
  const { selectedRowData } = useContext(SharedContext);
  return (
    <>
      <table className='execution-table'>
        <tbody>
          <tr>
            <th>User Given Name</th>
            <th>Workflow Given Name</th>
            <th>Start Time</th>
            <th>Run Time</th>
            <th>Status</th>
          </tr>
          {selectedRowData && (
            <tr key={selectedRowData?.name}>
              <td>{selectedRowData?.name}</td>
              <td>{selectedRowData?.uid}</td>
              <td>{selectedRowData?.startedAt}</td>
              <td>Missing Run Time</td>
              <td>{selectedRowData?.phase}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ExecutionTable;
