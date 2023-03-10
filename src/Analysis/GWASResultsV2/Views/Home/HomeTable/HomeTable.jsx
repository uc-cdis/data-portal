import { Button } from 'antd';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';
import './HomeTable.css';

const HomeTable = ({ data }) => {
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

        {data
          && data.map((item) => (
            <tr key={item?.uid}>
              <td>{item?.uid}</td>
              <td>{item?.name}</td>
              <td>{item?.startedAt}</td>
              <td>{item?.phase}</td>
              <td>
                {item.DateTimeSubmitted
                  || `item.DateTimeSubmiited missing at ${
                    new Date().toLocaleString()}`}
              </td>
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
  data: PropTypes.array.isRequired,
};

export default HomeTable;
