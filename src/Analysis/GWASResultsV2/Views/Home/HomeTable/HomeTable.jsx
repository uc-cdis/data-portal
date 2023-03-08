import { Button } from 'antd';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';

import './HomeTable.css';

const HomeTable = ({ tableData }) => {
  const {
    setCurrentView,
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
              <td>{item.RunId}</td>
              <td>{item.WorkflowName}</td>
              <td>{item.DateTimeStarted}</td>
              <td>{item.JobStatus}</td>
              <td>{item.DateTimeSubmitted}</td>
              <td>
                <Button
                  onClick={() => {
                    setCurrentExecutionData(item.ExecutionData);
                    setCurrentView('execution');
                  }}
                >
                  Execution
                </Button>
                <Button
                  onClick={() => {
                    setCurrentResultsData(item.ResultsData);
                    setCurrentView('results');
                  }}
                >
                  Results
                </Button>
              </td>
              <td>Actions</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
HomeTable.propTypes = {
  tableData: PropTypes.array.isRequired,
};

export default HomeTable;
