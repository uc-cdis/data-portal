import React, { useContext } from 'react';
import { Button, Dropdown, Switch, message } from 'antd';
import RestoreIcon from './ManageColumnsIcons/RestoreIcon';
import HolderIcon from './ManageColumnsIcons/HolderIcon';
import ManageColumnsIcon from './ManageColumnsIcons/ManageColumnsIcon';
import ColumnManagementDefault from './ColumnManagementDefault';
import SharedContext from '../../../Utils/SharedContext';
import './ManageColumns.css';

const ManageColumns = () => {
  const { columnManagement, setColumnManagement } = useContext(SharedContext);

  const handleRestoreDefaultsClick = (e) => {
    e.stopPropagation();
    message.success('Restored column defaults');
    setColumnManagement(ColumnManagementDefault);
  };

  const handleSwitchClick = (e) => {
    e.stopPropagation();
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              runId: !columnManagement.runId,
            });
          }}
        >
          <HolderIcon /> Run ID
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.runId} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              workflowName: !columnManagement.workflowName,
            });
          }}
        >
          <HolderIcon /> Workflow Name
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.workflowName} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              dateSubmitted: !columnManagement.dateSubmitted,
            });
          }}
        >
          <HolderIcon /> Date/Time Submitted
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.dateSubmitted} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              jobStatus: !columnManagement.jobStatus,
            });
          }}
        >
          <HolderIcon /> Job Status
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.jobStatus} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              dateFinished: !columnManagement.dateFinished,
            });
          }}
        >
          <HolderIcon /> Date/Time Finished
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.dateFinished} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              viewDetails: !columnManagement.viewDetails,
            });
          }}
        >
          <HolderIcon /> View Details
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.viewDetails} />
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
            handleSwitchClick(event);
            setColumnManagement({
              ...columnManagement,
              actions: !columnManagement.actions,
            });
          }}
        >
          <HolderIcon /> Actions
          <div className='manage-columns-switch'>
            <Switch size='small' checked={columnManagement.actions} />
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
