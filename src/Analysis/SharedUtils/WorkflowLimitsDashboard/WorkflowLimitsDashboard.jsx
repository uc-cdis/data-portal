import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { components } from '../../../params';
import './WorkflowLimitsDashboard.css';

const WorkflowLimitsDashboard = () => {
  const workflowRun = 10;
  const workflowLimit = 50;
  const supportEmail = components.login?.email || 'support@datacommons.io';
  return (
    <React.Fragment>
      <div className='workflow-limits-dashboard row'>
        <div className='column'>
          <h3>Monthly Workflow Limit</h3>
          <div>
            <strong>{workflowRun} used</strong> from {workflowLimit} Limit
          </div>
        </div>
        <div className='column progress'>
          {workflowRun >= workflowLimit && (
            <div>
              <div className='error-message'>
                You have exceeded your monthly workflow limit. Please contact
                support for assistance:
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
};

export default WorkflowLimitsDashboard;
