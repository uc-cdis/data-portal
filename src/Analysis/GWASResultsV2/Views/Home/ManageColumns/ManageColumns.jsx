import React, { useContext, useEffect } from 'react';
import { Button, Dropdown, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import InitialColumnManagement from '../../../Utils/StateManagement/DefaultColumnManagement';
import SharedContext from '../../../Utils/SharedContext';
import './ManageColumns.css';

const ManageColumns = () => {
  const { homeTableState, setHomeTableState } = useContext(SharedContext);

  useEffect(() => {
    // if using LocalStorage, update the columnManagement
    // storage with each state update
    if (homeTableState.useLocalStorage) {
      localStorage.setItem(
        'columnManagement',
        JSON.stringify(homeTableState.columnManagement)
      );
    }
  }, [homeTableState.columnManagement]);

  const restoreDefaults = () => {
    message.success('Restored column defaults');
    setHomeTableState({
      ...homeTableState,
      columnManagement: InitialColumnManagement,
    });
  };
  const toggleRunId = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      nameSearchTerm: '',
      columnManagement: {
        ...homeTableState.columnManagement,
        runId: !homeTableState.columnManagement.runId,
      },
    });
  const toggleWorkflowName = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      wfNameSearchTerm: '',
      columnManagement: {
        ...homeTableState.columnManagement,
        workflowName: !homeTableState.columnManagement.workflowName,
      },
    });

  const toggleDateSubmitted = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      submittedAtSelections: [],
      columnManagement: {
        ...homeTableState.columnManagement,
        dateSubmitted: !homeTableState.columnManagement.dateSubmitted,
      },
    });

  const toggleJobStatus = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      jobStatusSelections: [],
      columnManagement: {
        ...homeTableState.columnManagement,
        jobStatus: !homeTableState.columnManagement.jobStatus,
      },
    });

  const toggleDateFinished = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      finishedAtSelections: [],
      columnManagement: {
        ...homeTableState.columnManagement,
        dateFinished: !homeTableState.columnManagement.dateFinished,
      },
    });

  const toggleViewDetails = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      columnManagement: {
        ...homeTableState.columnManagement,
        viewDetails: !homeTableState.columnManagement.viewDetails,
      },
    });

  const toggleActions = () =>
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      columnManagement: {
        ...homeTableState.columnManagement,
        actions: !homeTableState.columnManagement.actions,
      },
    });

  const items = [
    {
      label: (
        <button
          type='button'
          className='dropdown-row restore-defaults'
          onClick={(event) => {
            event.stopPropagation();
            restoreDefaults();
          }}
        >
          <RestoreIcon /> Restore Defaults
        </button>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleRunId()}
          className='dropdown-row run-id'
          onClick={(event) => {
            event.stopPropagation();
            toggleRunId();
          }}
        >
          <HolderIcon /> Run ID
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.runId}
            />
          </div>
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleWorkflowName()}
          className='dropdown-row workflow-name'
          onClick={(event) => {
            event.stopPropagation();
            toggleWorkflowName();
          }}
        >
          <HolderIcon /> Workflow Name
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.workflowName}
            />
          </div>
        </div>
      ),
      key: '2',
    },

    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleDateSubmitted()}
          className='dropdown-row date-submitted'
          onClick={(event) => {
            event.stopPropagation();
            toggleDateSubmitted();
          }}
        >
          <HolderIcon /> Date/Time Submitted
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.dateSubmitted}
            />
          </div>
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleJobStatus()}
          className='dropdown-row job-status'
          onClick={(event) => {
            event.stopPropagation();
            toggleJobStatus();
          }}
        >
          <HolderIcon /> Job Status
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.jobStatus}
            />
          </div>
        </div>
      ),
      key: '4',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleDateFinished()}
          className='dropdown-row date-finished'
          onClick={(event) => {
            event.stopPropagation();
            toggleDateFinished();
          }}
        >
          <HolderIcon /> Date/Time Finished
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.dateFinished}
            />
          </div>
        </div>
      ),
      key: '5',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleViewDetails()}
          className='dropdown-row view-details'
          onClick={(event) => {
            event.stopPropagation();
            toggleViewDetails();
          }}
        >
          <HolderIcon /> View Details
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.viewDetails}
            />
          </div>
        </div>
      ),
      key: '6',
    },
    {
      label: (
        <div
          role='button'
          tabIndex={0}
          onKeyPress={() => toggleActions()}
          className='dropdown-row actions'
          onClick={(event) => {
            event.stopPropagation();
            toggleActions();
          }}
        >
          <HolderIcon /> Actions
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.actions}
            />
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
