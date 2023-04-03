import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { gwasWorkflowPath } from '../../../../localconf';
import SharedContext from '../../Utils/SharedContext';
import ExecutionTable from './ExecutionTable/ExecutionTable';
import PHASES from '../../Utils/PhasesEnumeration';
import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import './Execution.css';
import ErrorMessage from '../../SharedComponents/ErrorMessage/ErrorMessage';

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
        <DetailPageHeader pageTitle={'Execution Details'} />
        <div className='spinner-container'>
          <Spin />
        </div>
      </React.Fragment>
    );
  }
  if (status === 'error') {
    return (
      <React.Fragment>
        <DetailPageHeader pageTitle={'Execution Details'} />
        <ErrorMessage />
      </React.Fragment>
    );
  }

  const determineDataLengthZeroOutput = (phase) => {
    if (
      phase === PHASES.Succeeded
      || phase === PHASES.Pending
      || phase === PHASES.Running
    ) {
      return <strong>Workflow {phase}</strong>;
    } if (phase === PHASES.Error) {
      return <strong>Workflow Errored without Error Data</strong>;
    } if (phase === PHASES.Failed) {
      return <strong>Workflow Failed without Error Data</strong>;
    }
    return <strong>Issue with workflow phase and no data returned</strong>;
  };

  return (
    <React.Fragment>
      <DetailPageHeader pageTitle={'Execution Details'} />
      <ExecutionTable />
      <div className='execution-data'>
        <h2>Logs</h2>
        {data.length === 0 && (
          <React.Fragment>
            <p>{determineDataLengthZeroOutput(selectedRowData?.phase)}</p>
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
            <React.Fragment key={item?.name}>
              <p>
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
