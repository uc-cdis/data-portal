import React, { useContext } from 'react';
import { Button, Dropdown, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import InitialColumnManagement from '../../../Utils/InitialColumnManagement';
import SharedContext from '../../../Utils/SharedContext';
import './ManageColumns.css';

const ManageColumns = () => {
  const { homeTableState, setHomeTableState } = useContext(SharedContext);
  const items = [
    {
      label: (
        <div
          className='dropdown-row restore-defaults'
          role='button'
          onClick={(event) => {
            event.stopPropagation();
            message.success('Restored column defaults');
            setHomeTableState({
              ...homeTableState,
              columnManagement: InitialColumnManagement,
            });
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
            event.stopPropagation();
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
          className='dropdown-row workflow-name'
          onClick={(event) => {
            event.stopPropagation();
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
          className='dropdown-row date-submitted'
          onClick={(event) => {
            event.stopPropagation();
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
          className='dropdown-row job-status'
          onClick={(event) => {
            event.stopPropagation();
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
          className='dropdown-row date-finished'
          onClick={(event) => {
            event.stopPropagation();
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
          className='dropdown-row view-details'
          onClick={(event) => {
            event.stopPropagation();
            setHomeTableState({
              ...homeTableState,
              sortInfo: {},
              currentPage: 1,
              columnManagement: {
                ...homeTableState.columnManagement,
                viewDetails: !homeTableState.columnManagement.viewDetails,
              },
            });
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
          className='dropdown-row actions'
          onClick={(event) => {
            event.stopPropagation();
            setHomeTableState({
              ...homeTableState,
              sortInfo: {},
              currentPage: 1,
              columnManagement: {
                ...homeTableState.columnManagement,
                actions: !homeTableState.columnManagement.actions,
              },
            });
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
