import React, { useContext, useEffect } from 'react';
import { Button, Dropdown, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import DefaultColumnManagement from '../HomeTableState/DefaultColumnManagement';
import SharedContext from '../../../Utils/SharedContext';
import './ManageColumns.css';
import UpdateColumnManagement from '../HomeTableState/UpdateColumnManagement';

const ManageColumns = () => {
  const { homeTableState, setHomeTableState } = useContext(SharedContext);

  useEffect(() => {
    // if using LocalStorage, update the columnManagement
    // storage with each columnManagement update
    UpdateColumnManagement(homeTableState);
  }, [homeTableState.columnManagement]);

  const restoreDefaults = () => {
    message.success('Restored column defaults');
    setHomeTableState({
      ...homeTableState,
      columnManagement: DefaultColumnManagement,
    });
  };

  const filteringResets = {
    runId: { nameSearchTerm: '' },
    workflowName: { wfNameSearchTerm: '' },
    dateSubmitted: { submittedAtSelections: [] },
    jobStatus: { jobStatusSelections: [] },
    dateFinished: { finishedAtSelections: [] },
    viewDetails: {},
    actions: {},
  };
  const toggleColumn = (key) => {
    const filteringUpdate = filteringResets[key] || {};
    setHomeTableState({
      ...homeTableState,
      sortInfo: {},
      currentPage: 1,
      ...filteringUpdate,
      columnManagement: {
        ...homeTableState.columnManagement,
        [key]: !homeTableState.columnManagement[key],
      },
    });
  };

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
          onKeyPress={() => toggleColumn('showRunId')}
          className='dropdown-row run-id'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showRunId');
          }}
        >
          <HolderIcon /> Run ID
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showRunId}
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
          onKeyPress={() => toggleColumn('showWorkflowName')}
          className='dropdown-row workflow-name'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showWorkflowName');
          }}
        >
          <HolderIcon /> Workflow Name
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showWorkflowName}
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
          onKeyPress={() => toggleColumn('showDateSubmitted')}
          className='dropdown-row date-submitted'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showDateSubmitted');
          }}
        >
          <HolderIcon /> Date/Time Submitted
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showDateSubmitted}
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
          onKeyPress={() => toggleColumn('showJobStatus')}
          className='dropdown-row job-status'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showJobStatus');
          }}
        >
          <HolderIcon /> Job Status
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showJobStatus}
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
          onKeyPress={() => toggleColumn('showDateFinished')}
          className='dropdown-row date-finished'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showDateFinished');
          }}
        >
          <HolderIcon /> Date/Time Finished
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showDateFinished}
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
          onKeyPress={() => toggleColumn('showViewDetails')}
          className='dropdown-row view-details'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showViewDetails');
          }}
        >
          <HolderIcon /> View Details
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showViewDetails}
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
          onKeyPress={() => toggleColumn('showActions')}
          className='dropdown-row actions'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('showActions');
          }}
        >
          <HolderIcon /> Actions
          <div className='manage-columns-switch'>
            <Switch
              size='small'
              checked={homeTableState.columnManagement.showActions}
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
