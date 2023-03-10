import React, { useState, useEffect } from 'react';
import { Spin, List } from 'antd';
import { useQuery } from 'react-query';
import HomeTable from './HomeTable/HomeTable';
import { gwasWorkflowPath } from '../../../../localconf';
import GetTableDataFromApi from './Utils/GetTableDataFromApi';

const Home = () => {
  const [tableData, setTableData] = useState(GetTableDataFromApi());
  const pollingIntervalinMilliseconds = 5000;

  // PIETER CODE
  async function fetchGwasWorkflows() {
    const workflowsEndpoint = `${gwasWorkflowPath}workflows`;
    const getWorkflows = await fetch(workflowsEndpoint);
    return getWorkflows.json();
  }
  const GWASWorkflows = () => {
    const refetchInterval = 5000;
    const { data, status } = useQuery('workflows', fetchGwasWorkflows, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval,
    });
    if (status === 'loading') {
      return (
        <React.Fragment>
          <div className='GWASUI-spinnerContainer'>
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
    console.log('data', data);
    return (
      <React.Fragment>
        <h1>It works!</h1>
      </React.Fragment>
    );
  };

  return (
    <div>
      <GWASWorkflows />
      {tableData ? <HomeTable tableData={tableData} /> : <Spin />}
    </div>
  );
};
export default Home;
