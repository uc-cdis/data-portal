import React, { useContext } from 'react';
import { SharedContext } from '../../../Utils/constants';
import './HomeTable.css';

const HomeTable = () => {
  const setCurrentView = useContext(SharedContext);

  return (
    <table className='home-table'>
      <tbody>
        <tr>
          <th>Run ID</th>
          <th>Workflow Name</th>
          <th>Date/ Time Started</th>
          <th>Job Status</th>
          <th>Date/ Time Submitted</th>
          <th>View Details</th>
          <th>Actions</th>
        </tr>
        <tr>
          <td>some Run ID</td>
          <td>some Workflow Name</td>
          <td>some Date/ Time Started</td>
          <td>some Job Status</td>
          <td>some Date/ Time Submitted</td>
          <td>
            <div>
              <button onClick={() => setCurrentView('execution')}>
                Execution
              </button>
            </div>

            <div>
              <button onClick={() => setCurrentView('results')}>Results</button>
            </div>
          </td>
          <td>Actions</td>
        </tr>
      </tbody>
    </table>
  );
};
export default HomeTable;
