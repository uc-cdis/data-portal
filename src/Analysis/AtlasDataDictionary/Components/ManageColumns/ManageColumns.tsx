import React, { useState, useEffect } from 'react';
import {
  Button, Popover, Switch, Notification,
} from '@mantine/core';
import './ManageColumns.css';
import { IconCheck, IconX } from '@tabler/icons-react';
import ManageColumnsIcon from '../../../GWASResults/Views/Home/ManageColumns/ManageColumnsIcons/ManageColumnsIcon';
import RestoreIcon from '../../../GWASResults/Views/Home/ManageColumns/ManageColumnsIcons/RestoreIcon';

const ManageColumns = () => {
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    // when the component is mounted, the alert is displayed for 3 seconds
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  }, [showNotification]);

  return (
    <div className='manage-columns-wrapper'>

      <Popover opened={opened} onChange={setOpened}>
        <Popover.Target>
          <Button
            leftIcon={<ManageColumnsIcon />}
            onClick={() => setOpened(!opened)}
            variant='white'
            size='compact-md'
            className={opened ? 'opened' : ''}
          >
            Manage Columns
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <div role='button' onClick={() => setShowNotification(true)}><RestoreIcon /> Restore Defaults</div>
          <hr />
        Vocabularly ID
          <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />

        </Popover.Dropdown>
      </Popover>
      {showNotification
      && (
        <div style={{
          position: 'fixed', top: 50, left: '50%', transform: 'translate(-50%,-50%)', zIndex: 100,
        }}
        >
          <Notification icon={<React.Fragment>&#x2713;</React.Fragment>} color='teal' withCloseButton={false} title='Restored column defaults' />
        </div>
      )}
    </div>
  );
};

export default ManageColumns;
