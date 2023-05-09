import React, { useState } from 'react';
import { Button, Dropdown, Menu, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import './ManageColumns.css';

const ManageColumns = () => {
  const [restoreDefaults, setRestoreDefaults] = useState(true);
  const [runIdCheck, setRunIdCheck] = useState(true);
  const [workflowNameCheck, setWorkflowNameCheck] = useState(true);
  const [dateSubmittedCheck, setDateSubmittedCheck] = useState(true);
  const [jobStatusCheck, setJobStatusCheck] = useState(true);
  const [dateFinishedCheck, setDateFinishedCheck] = useState(true);
  const [viewDetailsCheck, setViewDetailsCheck] = useState(true);
  const [actionsCheck, setActionsCheck] = useState(true);

  const handleRestoreDefaultsClick = (e) => {
    e.stopPropagation();
    message.success('Restored column defaults');
  };

  const handleRunIdToggle = (e) => {
    e.stopPropagation();
    // setRunId();
  };

  const handleWorkflowNameToggle = (e) => {
    e.stopPropagation();
    // setWorkflowName();
  };

  const items = [
    {
      label: (
        <div
          className='dropdown-row restore-defaults'
          onClick={(event) => {
            handleRestoreDefaultsClick(event);
          }}
        >
          <RestoreIcon /> Restore Defaults
        </div>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          className='dropdown-row run-id'
          onClick={(event) => {
            handleRunIdToggle(event);
            setRunIdCheck(runIdCheck ? false : true);
          }}
        >
          <HolderIcon /> Run ID
          <div className='manage-columns-switch'>
            <Switch size='small' checked={runIdCheck} />
          </div>
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div
          className='dropdown-row workflow-name'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setWorkflowNameCheck(workflowNameCheck ? false : true);
          }}
        >
          <HolderIcon /> Workflow Name
          <div className='manage-columns-switch'>
            <Switch size='small' checked={workflowNameCheck} />
          </div>
        </div>
      ),
      key: '2',
    },

    {
      label: (
        <div
          className='dropdown-row date-submitted'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setDateSubmittedCheck(dateSubmittedCheck ? false : true);
          }}
        >
          <HolderIcon /> Date/Time Submitted
          <div className='manage-columns-switch'>
            <Switch size='small' checked={dateSubmittedCheck} />
          </div>
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div
          className='dropdown-row job-status'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setJobStatusCheck(jobStatusCheck ? false : true);
          }}
        >
          <HolderIcon /> Job Status
          <div className='manage-columns-switch'>
            <Switch size='small' checked={jobStatusCheck} />
          </div>
        </div>
      ),
      key: '4',
    },
    {
      label: (
        <div
          className='dropdown-row date-finished'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setDateFinishedCheck(dateFinishedCheck ? false : true);
          }}
        >
          <HolderIcon /> Date/Time Finished
          <div className='manage-columns-switch'>
            <Switch size='small' checked={dateFinishedCheck} />
          </div>
        </div>
      ),
      key: '5',
    },
    {
      label: (
        <div
          className='dropdown-row date-finished'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setViewDetailsCheck(viewDetailsCheck ? false : true);
          }}
        >
          <HolderIcon /> View Details
          <div className='manage-columns-switch'>
            <Switch size='small' checked={viewDetailsCheck} />
          </div>
        </div>
      ),
      key: '6',
    },
    {
      label: (
        <div
          className='dropdown-row actions'
          onClick={(event) => {
            handleWorkflowNameToggle(event);
            setActionsCheck(actionsCheck ? false : true);
          }}
        >
          <HolderIcon /> Actions
          <div className='manage-columns-switch'>
            <Switch size='small' checked={actionsCheck} />
          </div>
        </div>
      ),
      key: '7',
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      className='manage-columns'
      overlayClassName='manage-columns-dropdown'
      trigger={['click']}
    >
      <Button className='manage-columns-button'>
        <ManageColumnsIcon />
        Manage columns
      </Button>
    </Dropdown>
  );
};

export default ManageColumns;
