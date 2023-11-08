import React from 'react';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import HomeTable from './HomeTable/HomeTable';
import { gwasWorkflowPath } from '../../../../localconf';
import LoadingErrorMessage from '../../../SharedUtils/LoadingErrorMessage/LoadingErrorMessage';
import ManageColumns from './ManageColumns/ManageColumns';

const Home = () => {
  const refetchInterval = 5000;

  async function fetchGwasWorkflows() {
    const currentTeamProject = localStorage.getItem('teamProject');
    const workflowsEndpoint = `${gwasWorkflowPath}workflows?team_projects=${currentTeamProject}`;
    const getWorkflows = await fetch(workflowsEndpoint);
    return getWorkflows.json();
  }

  const { data, status } = useQuery('workflows', fetchGwasWorkflows, {
    refetchInterval,
  });
  if (status === 'loading') {
    return (
      <React.Fragment>
        <div className='spinner-container'>
          <Spin /> Retrieving the list of workflows.
          <br />
          Please wait...
        </div>
      </React.Fragment>
    );
  }
  if (status === 'error') {
    return <LoadingErrorMessage />;
  }
  console.log("data",data)
  return (
    <React.Fragment>
      <ManageColumns />
      <HomeTable data={data[0]} />
    </React.Fragment>
  );
};
export default Home;
