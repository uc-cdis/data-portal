import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { gwasWorkflowPath } from '../../../../localconf';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';
import ExecutionTable from './ExecutionTable';
import './Execution.css';

const Execution = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const endpoint = `${gwasWorkflowPath}logs/${name}?uid=${uid}`;

  async function fetchExecutionData() {
    const getData = await fetch(endpoint);
    return getData.json();
  }
  const { data, status } = useQuery('ExecutionData', fetchExecutionData);

  if (status === 'loading') {
    return (
      <React.Fragment>
        <ReturnHomeButton />
        <div className='spinner-container'>
          <Spin />
        </div>
      </React.Fragment>
    );
  }
  if (status === 'error') {
    return (
      <React.Fragment>
        <ReturnHomeButton />
        <h1>Error loading data for table</h1>
      </React.Fragment>
    );
  }
  console.log(data);
  return (
    <React.Fragment>
      <ReturnHomeButton />
      <h1>Execution</h1>
      <ExecutionTable />
      <div className='execution-data'>
        <h2>Logs</h2>
        {data.length === 0 && (
          <React.Fragment>
            <p>
              {selectedRowData?.phase === 'Succeeded' && (
                <strong>Workflow Succeeded</strong>
              )}
              {selectedRowData?.phase === 'Error' && (
                <strong>Workflow Errored without Error Data</strong>
              )}
              {selectedRowData?.phase === 'Failed' && (
                <strong>Workflow Failed without Error Data</strong>
              )}
            </p>
          </React.Fragment>
        )}
        {data.error && JSON.stringify(data)}
        {data.length > 0
          && data.map((item) => (
            <React.Fragment>
              <p key={item.uid}>
                <strong>Name: {item.name}</strong>
                <br />
                step_template: {item.step_template}
                <br />
                error_message: {item.error_message}
              </p>
              <br />
            </React.Fragment>
          ))}
        {JSON.stringify(data)}
      </div>
    </React.Fragment>
  );
};

export default Execution;
