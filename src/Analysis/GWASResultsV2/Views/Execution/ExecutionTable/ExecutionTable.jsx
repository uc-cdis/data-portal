import React, { useContext } from 'react';
import SharedContext from '../../../Utils/SharedContext';

const ExecutionTable = () => {
  const { selectedRowData } = useContext(SharedContext);
  return (
    <div className='execution-table-container'>
      <table className='execution-table' data-testid='execution-table'>
        <tbody>
          <tr>
            <th>User Given Name</th>
            <th>Workflow Given Name</th>
            <th>Start Time</th>
            <th>Run Duration</th>
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
    </div>
  );
};

export default ExecutionTable;
