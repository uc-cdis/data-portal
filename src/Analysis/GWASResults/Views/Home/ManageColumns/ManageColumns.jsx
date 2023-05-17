import React, { useContext, useEffect } from 'react';
import { Button, Dropdown, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import InitialColumnManagement from '../HomeTableState/DefaultColumnManagement';
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
      columnManagement: InitialColumnManagement,
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
          onKeyPress={() => toggleColumn('runId')}
          className='dropdown-row run-id'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('runId');
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
          onKeyPress={() => toggleColumn('workflowName')}
          className='dropdown-row workflow-name'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('workflowName');
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
          onKeyPress={() => toggleColumn('dateSubmitted')}
          className='dropdown-row date-submitted'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('dateSubmitted');
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
          onKeyPress={() => toggleColumn('jobStatus')}
          className='dropdown-row job-status'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('jobStatus');
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
          onKeyPress={() => toggleColumn('dateFinished')}
          className='dropdown-row date-finished'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('dateFinished');
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
          onKeyPress={() => toggleColumn('viewDetails')}
          className='dropdown-row view-details'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('viewDetails');
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
          onKeyPress={() => toggleColumn('actions')}
          className='dropdown-row actions'
          onClick={(event) => {
            event.stopPropagation();
            toggleColumn('actions');
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
