import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  Button,
  Popover,
  Switch,
  Notification,
  Grid,
  Space,
} from '@mantine/core';
import ManageColumnsIcon from '../Icons/ManageColumnsIcon';
import RestoreIcon from '../Icons/RestoreIcon';
import HolderIcon from '../Icons/HolderIcon';
import { IColumnManagementData } from '../../Interfaces/Interfaces';
import './ManageColumns.css';
import ColumnsItems from '../../Utils/ColumnItems';

interface IManageColumns {
  handleTableChange: Function;
  columnManagementData: IColumnManagementData;
}
const ManageColumns = ({
  handleTableChange,
  columnManagementData,
}: IManageColumns) => {
  const [opened, setOpened] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationDisplayTimeInMilliseconds = 3000;
  const iconSpanSize = 1;
  const columnManagementResetButtonSpanSize = 11;
  const columnLabelSpanSize = 9;
  const switchSpanSize = 2;

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, notificationDisplayTimeInMilliseconds);
    }
  }, [showNotification]);

  useEffect(() => {
    localStorage.setItem(
      'atlasDataDictionaryColumnManagement',
      JSON.stringify(columnManagementData),
    );
  }, [columnManagementData]);

  const columnManagementReset = () => {
    handleTableChange(
      'columnManagementReset',
      'columnManagementReset',
    );
    setShowNotification(true);
  };

  const formatJSX = (jsx) => {
    const renderedHTMLString = ReactDOMServer.renderToStaticMarkup(jsx);
    const HTMLStringWithoutTags = renderedHTMLString.replace(/<[^>]*>?/g, ' ').trim();
    return <React.Fragment>{HTMLStringWithoutTags}</React.Fragment>;
  };

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
          <div
            className='column-control-button restore-defaults'
            role='button'
            tabIndex={0}
            onKeyPress={() => columnManagementReset()}
            onClick={() => columnManagementReset()}
          >
            <Grid align='flex-start'>
              <Grid.Col span={iconSpanSize}>
                <RestoreIcon />
              </Grid.Col>
              <Grid.Col span={columnManagementResetButtonSpanSize} className={'column-label'}>
                Restore Defaults
              </Grid.Col>
            </Grid>
          </div>
          <hr />
          <Space h='md' />
          {ColumnsItems.map((item, i) => (
            <div
              key={i}
              className='column-control-button'
              role='button'
              tabIndex={0}
              onKeyPress={() => handleTableChange('columnManagementUpdateOne', item.headerKey)}
              onClick={() => handleTableChange('columnManagementUpdateOne', item.headerKey)}
            >
              <Grid align='flex-start'>
                <Grid.Col span={iconSpanSize}>
                  <HolderIcon />
                </Grid.Col>
                <Grid.Col className={'column-label'} span={columnLabelSpanSize}>
                  {formatJSX(item.jsx)}
                </Grid.Col>
                <Grid.Col span={switchSpanSize}>
                  <Switch
                    tabIndex={-1}
                    checked={columnManagementData[item.headerKey]}
                  />
                </Grid.Col>
              </Grid>
            </div>
          ))}
        </Popover.Dropdown>
      </Popover>
      {showNotification && (
        <div
          className='manage-columns-notification'
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
