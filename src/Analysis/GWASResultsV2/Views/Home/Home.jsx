import React, { useState } from 'react';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import HomeTable from './HomeTable/HomeTable';
import { gwasWorkflowPath } from '../../../../localconf';

const Home = () => {
  const refetchInterval = 5000;

  async function fetchGwasWorkflows() {
    const workflowsEndpoint = `${gwasWorkflowPath}workflows`;
    const getWorkflows = await fetch(workflowsEndpoint);
    return getWorkflows.json();
  }
  const GWASWorkflows = () => {
    const { data, status } = useQuery('workflows', fetchGwasWorkflows, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval,
    });
    if (status === 'loading') {
      return (
        <React.Fragment>
          <div className='spinner-container'>
            <Spin />
          </div>
        </React.Fragment>
      );
    }
    if (status === 'error') {
      return (
        <React.Fragment>
          <h1>Error loading data for table</h1>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <HomeTable data={data} />
      </React.Fragment>
    );
  };

  return (
    <div>
      <GWASWorkflows />
    </div>
  );
};
export default Home;
