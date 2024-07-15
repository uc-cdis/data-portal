import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './WorkflowLimitsDashboard.css';
const WorkflowLimitsDashboard = ({}) => {
  const workflow_run = 59;
  const workflow_limit = 50;

  return (
    <React.Fragment>
      <div className='workflow-limits-dashboard row'>
        <div className='column'>
          <h3>Monthly Workflow Limit</h3>
          <div>
            <strong>{workflow_run} used</strong> from {workflow_limit} Limit
          </div>
        </div>
        <div className='column progress'>
          {workflow_run >= workflow_limit && (
            <div className='error-message'>
              !&#x20DD; You have exceeded your monthly workflow limit. Please
              contact support for assistance.
            </div>
          )}
          <Progress
            percent={(workflow_run / workflow_limit) * 100}
            showInfo={false}
            status={workflow_run >= workflow_limit ? 'exception' : 'success'}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default WorkflowLimitsDashboard;
