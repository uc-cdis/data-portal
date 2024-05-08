import React from 'react';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import HomeTable from './HomeTable/HomeTable';
import LoadingErrorMessage from '../../../SharedUtils/LoadingErrorMessage/LoadingErrorMessage';
import ManageColumns from './ManageColumns/ManageColumns';
import { fetchGwasWorkflows } from '../../Utils/gwasWorkflowApi';

const Home = ({ selectedTeamProject }) => {
  const refetchInterval = 5000;
  const { data, status } = useQuery(['workflows', selectedTeamProject],
    fetchGwasWorkflows, {
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
  return (
    <React.Fragment>
      <ManageColumns />
      <HomeTable data={data} />
    </React.Fragment>
  );
};
export default Home;
