import React from 'react';
import { useQuery } from 'react-query';
import { Spin, Progress } from 'antd';
import { components } from '../../../params';
import {
  fetchMonthlyWorkflowLimitInfo,
  workflowLimitsLoadingErrorMessage,
  workflowLimitsInvalidDataMessage,
  workflowLimitInfoIsValid,
} from './WorkflowLimitsUtils';
import LoadingErrorMessage from '../LoadingErrorMessage/LoadingErrorMessage';
import './WorkflowLimitsDashboard.css';

const WorkflowLimitsDashboard = React.memo(() => {
  const supportEmail = components.login?.email || 'support@datacommons.io';
  const refetchInterval = 5000;

  const { data, status } = useQuery(
    ['monthly-workflow-limit'],
    fetchMonthlyWorkflowLimitInfo,
    {
      refetchInterval,
    },
  );
  if (status === 'loading') {
    return (
      <div className='workflow-limits-dashboard row'>
        <div className='spinner-container'>
          <Spin /> Retrieving user workflow information.
          <br />
          Please wait...
        </div>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className='workflow-limits-dashboard row'>
        <LoadingErrorMessage message={workflowLimitsLoadingErrorMessage} />
      </div>
    );
  }
  if (status === 'success' && !workflowLimitInfoIsValid(data)) {
    return (
      <div className='workflow-limits-dashboard row'>
        <LoadingErrorMessage message={workflowLimitsInvalidDataMessage} />
      </div>
    );
  }
  const workflowRun = data.workflow_run;
  const workflowLimit = data.workflow_limit;

  return (
    <React.Fragment>
      <div className='workflow-limits-dashboard row'>
        <div className='column'>
          <h3>Monthly Workflow Limit</h3>
          <div data-testid='workflow-limits-message'>
            <strong>{workflowRun} used</strong> from {workflowLimit} Limit
          </div>
        </div>
        <div className='column progress'>
          {workflowRun >= workflowLimit && (
            <div>
              <div
                className='error-message'
                data-testid='workflow-exceeds-message'
              >
                You have exceeded your monthly workflow limit. Please contact
                support for assistance:{' '}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
              </div>
            </div>
          )}
          <Progress
            percent={(workflowRun / workflowLimit) * 100}
            showInfo={false}
            status={workflowRun >= workflowLimit ? 'exception' : 'success'}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

export default WorkflowLimitsDashboard;
