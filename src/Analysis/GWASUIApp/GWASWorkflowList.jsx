import React, { useEffect } from 'react';
import { Collapse, List } from 'antd';
import './GWASUIApp.css';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { gwasWorkflowPath } from '../../localconf';
import { fetchAndSetCsrfToken } from '../../configs';
import GWASJob from './GWASJob';

const GWASWorkflowList = ({ refreshWorkflows }) => {
  const { Panel } = Collapse;

  useEffect(() => {
    fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
  }, []);

  async function fetchGwasWorkflows() {
    const workflowsEndpoint = `${gwasWorkflowPath}workflows`;
    const getWorkflows = await fetch(workflowsEndpoint);
    return getWorkflows.json();
  }

  const GWASWorkflows = () => {
    const { data, status } = useQuery('workflows', fetchGwasWorkflows);
    if (status === 'loading') {
      return <React.Fragment>Loading</React.Fragment>;
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
              renderItem={(item) => (
                <GWASJob refreshWorkflows={refreshWorkflows} workflow={item} />
              )}
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
  refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASWorkflowList;
