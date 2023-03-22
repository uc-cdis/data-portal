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
  console.log('selectedRowData ', selectedRowData);

  // THIS IS THE PROBLEM: The example endpoint works. See line below.
  // BUT the generated endpoints do not, even though they look like they in good format.
  // Example:
  const exampleEndpoint =
    'https://qa-mickey.planx-pla.net/ga4gh/wes/v2/logs/gwas-workflow-9317784556?uid=4b125c09-9712-486f-bacd-ec1451aae935';
  // const endpoint = `${gwasWorkflowPath}logs/${name}?uid=${uid}`;
  const endpoint = `https://qa-mickey.planx-pla.net/ga4gh/wes/v2/logs/${name}?uid=${uid}`;

  async function fetchExecutionData() {
    const getData = await fetch(exampleEndpoint);
    return getData.json();
  }
  const { data, status } = useQuery('ExecutionData', fetchExecutionData, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
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
      <div style={{ fontFamily: 'monospace' }}>
        <br />
        <span>
          Example
          <br />
          Endpoint: {exampleEndpoint}
        </span>
        <br />
        <strong>Generated</strong>
        <br />
        <strong>Endpoint:</strong> {endpoint}
      </div>
      <div className='execution-data'>
        <h2>Logs</h2>
        {data.length === 0 && (
          <React.Fragment>
            <p>
              <strong>Error!</strong> Returned array has length of zero
            </p>
          </React.Fragment>
        )}
        {data.error && JSON.stringify(data)}
        {data.length > 1 &&
          data.map((item) => (
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
      </div>
    </React.Fragment>
  );
};

export default Execution;
