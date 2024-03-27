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

  const columnControls = [
    {
      label: 'Vocabulary ID',
      id: 'vocabularyID',
    },
    {
      label: 'Concept ID',
      id: 'conceptID',
    },
    {
      label: 'Concept Code',
      id: 'conceptCode',
    },
    {
      label: 'Concept Name',
      id: 'conceptName',
    },
    {
      label: 'Concept Class ID',
      id: 'conceptClassID',
    },
    {
      label: '# / % of People with Variable',
      id: 'numberPercentagePeopleWithVariable',
    },
    {
      label: '# / % of People Where Variable is Filled',
      id: 'numberPercentageOfPeopleWhereValueIsFilled',
    },
    {
      label: '# / % of People Where Variable is Null',
      id: 'numberPercentageOfPeopleWhereValueIsNull',
    },
    {
      label: 'Value Summary',
      id: 'valueSummary',
    },
  ];

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
          <div
            className='column-control-button restore-defaults'
            role='button'
            tabIndex={0}
            onKeyPress={() => {
              handleTableChange(
                'columnManagementReset',
                'columnManagementReset'
              );
              setShowNotification(true);
            }}
            onClick={() => {
              handleTableChange(
                'columnManagementReset',
                'columnManagementReset'
              );
              setShowNotification(true);
            }}
          >
            <Grid align='flex-start'>
              <Grid.Col span={1}>
                <RestoreIcon />
              </Grid.Col>
              <Grid.Col span={11} className={'column-label'}>
                Restore Defaults
              </Grid.Col>
            </Grid>
          </div>
          <hr />
          <Space h='md' />

          {columnControls.map((item, i) => (
            <div
              key={i}
              className='column-control-button'
              role='button'
              tabIndex={0}
              onKeyPress={() =>
                handleTableChange('columnManagementUpdateOne', item.id)
              }
              onClick={() => {
                handleTableChange('columnManagementUpdateOne', item.id);
              }}
            >
              <Grid align='flex-start'>
                <Grid.Col span={1}>
                  <HolderIcon />
                </Grid.Col>
                <Grid.Col className={'column-label'} span={8}>
                  {item.label}
                </Grid.Col>
                <Grid.Col span={3}>
                  <Switch tabIndex={-1} checked={columnManagement[item.id]} />
                </Grid.Col>
              </Grid>
            </div>
          ))}
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
