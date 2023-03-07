import { Button } from 'antd';
import React, { useContext } from 'react';
import SharedContext from '../../../Utils/SharedContext';
import './HomeTable.css';

const HomeTable = () => {
  const {
    setCurrentView,
    tableData,
    setCurrentExecutionData,
    setCurrentResultsData,
  } = useContext(SharedContext);

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

        {tableData
          && tableData.map((item) => (
            <tr key={item.RunId}>
              <React.Fragment key={item.RunId}>
                <td>{item.RunId}</td>
                <td>{item.WorkflowName}</td>
                <td>{item.DateTimeStarted}</td>
                <td>{item.JobStatus}</td>
                <td>{item.DateTimeSubmitted}</td>
                <td>
                  <div>
                    <Button
                      onClick={() => {
                        setCurrentExecutionData(item.ExecutionData);
                        setCurrentView('execution');
                      }}
                    >
                      Execution
                    </Button>
                  </div>

                  <div>
                    <Button
                      onClick={() => {
                        setCurrentResultsData(item.ResultsData);
                        setCurrentView('results');
                      }}
                    >
                      Results
                    </Button>
                  </div>
                </td>
                <td>Actions</td>
              </React.Fragment>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
export default HomeTable;
