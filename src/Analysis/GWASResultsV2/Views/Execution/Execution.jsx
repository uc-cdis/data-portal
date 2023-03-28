import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { gwasWorkflowPath } from '../../../../localconf';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';
import ExecutionTable from './ExecutionTable/ExecutionTable';
import PHASES from '../../Utils/PhasesEnumeration';
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
  return (
    <React.Fragment>
      <div className='details-page-container'>
        <ReturnHomeButton />
        <h1 className='details-page-header'>Execution Details</h1>
      </div>
      <ExecutionTable />
      <div className='execution-data'>
        <h2>Logs</h2>
        {data.length === 0 && (
          <React.Fragment>
            <p>
              {selectedRowData?.phase === PHASES.Succeeded && (
                <strong>Workflow Succeeded</strong>
              )}
              {selectedRowData?.phase === PHASES.Error && (
                <strong>Workflow Errored without Error Data</strong>
              )}
              {selectedRowData?.phase === PHASES.Failed && (
                <strong>Workflow Failed without Error Data</strong>
              )}
            </p>
          </React.Fragment>
        )}
        {data.error && (
          <p>
            <strong>Returned Data contains error message: </strong>
            <br />
            {JSON.stringify(data)}
          </p>
        )}
        {data.length > 0
          && !data.error
          && data.map((item) => (
            <React.Fragment>
              <p key={item?.name}>
                <strong>
                  Name: <span>{item?.name}</span>
                </strong>
                <br />
                step_template: <span>{item?.step_template}</span>
                <br />
                error_message: <span>{item?.error_message}</span>
              </p>
              <br />
            </React.Fragment>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Execution;
