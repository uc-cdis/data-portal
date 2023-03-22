import React, { useContext, useState } from 'react';
import { gwasWorkflowPath } from '../../../../localconf';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';

const Execution = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  // Example:
  // https://qa-mickey.planx-pla.net/ga4gh/wes/v2/logs/gwas-workflow-9317784556?uid=4b125c09-9712-486f-bacd-ec1451aae935
  const endpoint = `${gwasWorkflowPath}logs/${name}?uid=${uid}`;

  async function fetchExecutionData() {
    const getData = await fetch(endpoint);
    return getData.json();
  }
  const { data, status } = useQuery('workflows', fetchExecutionData, {
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
      <strong>Name: </strong> {name}
      <br />
      <strong>UID: </strong> {uid}
      <br />
      <strong>Endpoint:</strong> {endpoint}
      <div className='execution-data'>
        {data.map((item) => (
          <>
            <p key={item.uid}>
              <strong>Name: {item.name}</strong>
              <br />
              UID: {item.uid}
              <br />
              Phase: {item.phase}
              <br />
              Started At: {item.startedAt}
              <br />
              Finished At: {item.finishedAt}
            </p>
            <br />
          </>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Execution;
