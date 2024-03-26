import React, { useState, useEffect } from 'react';
import {
  Button,
  Popover,
  Switch,
  Notification,
  Grid,
  Space,
} from '@mantine/core';
import ManageColumnsIcon from '../../../GWASResults/Views/Home/ManageColumns/ManageColumnsIcons/ManageColumnsIcon';
import RestoreIcon from '../../../GWASResults/Views/Home/ManageColumns/ManageColumnsIcons/RestoreIcon';
import HolderIcon from '../../../GWASResults/Views/Home/ManageColumns/ManageColumnsIcons/HolderIcon';
import './ManageColumns.css';

const ManageColumns = ({ handleTableChange, columnManagement }) => {
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationDisplayTimeInMilliseconds = 3000;
  useEffect(() => {
    // when the component is mounted, the alert is displayed for 3 seconds
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, notificationDisplayTimeInMilliseconds);
    }
  }, [showNotification]);

  return (
    <div className='manage-columns-wrapper'>
      <Popover opened={opened} onChange={setOpened}>
        <Popover.Target>
          <Button
            classNames='manage-columns-button'
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
          <Button
            variant='subtle'
            size='xs'
            compact
            leftIcon={<RestoreIcon />}
            onClick={() => setShowNotification(true)}
          >
            Restore Defaults
          </Button>
          <hr />
          <Space h='md' />
          <Grid>
            <Grid.Col span={9}>
              <HolderIcon />
              Vocabularly ID
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                checked={columnManagement.vocabularyID}
                onChange={(event) => {
                  handleTableChange('columnManagement', 'vocabularyID');
                  setChecked(event.currentTarget.checked);
                }}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={9}>
              <HolderIcon />
              Some other thing
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch checked={true} onChange={() => console.log(0)} />
            </Grid.Col>
          </Grid>
        </Popover.Dropdown>
      </Popover>
      {showNotification && (
        <div
          style={{
            position: 'fixed',
            top: 50,
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 100,
          }}
        >
          <Notification
            icon={<React.Fragment>&#x2713;</React.Fragment>}
            color='teal'
            withCloseButton={false}
            title='Restored column defaults'
          />
        </div>
      )}
    </div>
  );
};

export default ManageColumns;
