import React, { useState } from 'react';
import { Button, Dropdown, Menu, Switch } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import './ManageColumns.css';

const ManageColumns = () => {
  const [restoreDefaults, setRestoreDefaults] = useState(false);
  const [runId, setRunId] = useState(false);
  const [workflowName, setWorkflowName] = useState(false);

  const handleRestoreDefaultsClick = () => {
    window.location.href = 'https://www.google.com';
  };

  const handleRunIdToggle = (e) => {
    e.stopPropagation();
    setRunId();
  };

  const handleWorkflowNameToggle = () => {
    setWorkflowName();
  };

  const items = [
    {
      label: (
        <div
          className='dropdown-row restore-defaults'
          onClick={(e) => {
            handleRestoreDefaultsClick();
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
            setRunId(runId ? 0 : 1);
          }}
        >
          <HolderIcon /> Run ID{' '}
          <div style={{ width: 30, float: 'right' }}>
            <Switch size='small' checked={runId} onChange={() => setRunId(1)} />
          </div>
        </div>
      ),
      key: '1',
    },

    {
      label: (
        <div
          className='dropdown-row workflow-name'
          onClick={(e) => {
            e.stopPropagation();
            return setWorkflowName();
          }}
        >
          <HolderIcon /> Workflow Name
          <Switch
            checked={workflowName}
            onChange={(e) => handleWorkflowNameToggle(e)}
          />
        </div>
      ),
      key: '3',
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
