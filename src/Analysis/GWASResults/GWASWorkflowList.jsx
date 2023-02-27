import React from 'react';
import { Collapse, List, Spin } from 'antd';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { gwasWorkflowPath } from '../../localconf';
import GWASJob from './GWASJob';
import './GWASResults.css';

const GWASWorkflowList = ({ refetchInterval }) => {
  const { Panel } = Collapse;

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
          <div className='GWASUI-spinnerContainer'>
            <Spin />
          </div>
        </React.Fragment>
      );
    }
    if (status === 'error') {
      return <React.Fragment>Error</React.Fragment>;
    }

    return (
      <React.Fragment>
        <Collapse onClick={(event) => event.stopPropagation()}>
          <Panel header='Submitted Job Statuses' key='1'>
            <List
              className='GWASApp__jobStatusList'
              itemLayout='horizontal'
              pagination={{ pageSize: 5 }}
              dataSource={data}
              renderItem={(item) => <GWASJob workflow={item} />}
            />
          </Panel>
        </Collapse>
      </React.Fragment>
    );
  };

  return (
    <div className='GWASApp-jobStatus'>
      <GWASWorkflows />
    </div>
  );
};

GWASWorkflowList.propTypes = {
  refetchInterval: PropTypes.number.isRequired,
};

export default GWASWorkflowList;
