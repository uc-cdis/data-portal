import React, { useContext, useEffect } from 'react';
import {
  Button, Dropdown, Switch, message,
} from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import DefaultColumnManagement from '../HomeTableState/DefaultColumnManagement';
import SharedContext from '../../../Utils/SharedContext';
import UpdateColumnManagement from '../HomeTableState/UpdateColumnManagement';
import './ManageColumns.css';

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

  const columnSwitch = (switchTitle, columnBoolean) => (
    <div
      role='button'
      tabIndex={0}
      onKeyPress={() => toggleColumn(columnBoolean)}
      className='dropdown-row'
      onClick={(event) => {
        event.stopPropagation();
        toggleColumn(columnBoolean);
      }}
    >
      <HolderIcon /> {switchTitle}
      <div className='manage-columns-switch'>
        <Switch
          size='small'
          checked={homeTableState.columnManagement[columnBoolean]}
        />
      </div>
    </div>
  );

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
      label: columnSwitch('Run ID', 'showRunId'),
      key: '1',
    },
    {
      label: columnSwitch('Workflow Name', 'showWorkflowName'),
      key: '2',
    },

    {
      label: columnSwitch('Date/Time Submitted', 'showDateSubmitted'),
      key: '3',
    },
    {
      label: columnSwitch('Job Status', 'showJobStatus'),
      key: '4',
    },
    {
      label: columnSwitch('Date/Time Finished', 'showDateFinished'),
      key: '5',
    },
    {
      label: columnSwitch('View Details', 'showViewDetails'),
      key: '6',
    },
    {
      label: columnSwitch('Actions', 'showActions'),
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
