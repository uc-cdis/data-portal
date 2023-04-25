import React from 'react';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import HomeTable from './HomeTable/HomeTable';
import { gwasWorkflowPath } from '../../../../localconf';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';

const Home = () => {
  const refetchInterval = 5000;

  async function fetchGwasWorkflows() {
    const workflowsEndpoint = `${gwasWorkflowPath}workflows`;
    const getWorkflows = await fetch(workflowsEndpoint);
    return getWorkflows.json();
  }

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
    return <LoadingErrorMessage />;
  }
  return (
    <React.Fragment>
      <HomeTable data={data} />
    </React.Fragment>
  );
};
export default Home;
