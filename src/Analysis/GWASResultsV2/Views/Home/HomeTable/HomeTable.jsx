import { Button, Table, Space, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';
import './HomeTable.css';
import Completed from './icons/Completed';
import Pending from './icons/Pending';
import Running from './icons/Running';
import Failed from './icons/Failed';

const HomeTable = ({ data }) => {
    const dropDownItems = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Download
        </a>
      ),
      disabled: true,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Rerun
        </a>
      ),
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Archive Job
        </a>
      ),
      disabled: true,
    },
  ];

  const { setCurrentView, setSelectedRowData } = useContext(SharedContext);
  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => {return a.uid.localeCompare(b.uid)},
    },
    {
      title: 'Workflow name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {return a.name.localeCompare(b.name)},
    },
    {
      title: 'Date/ Time Started',
      dataIndex: 'startedAt',
      key: 'startedAt',
      sorter: (a, b) => {return a.startedAt.localeCompare(b.startedAt)},
    },
    {
      title: 'Job status',
      key: 'phase',
      render: (record) => {
        return (
          <>
            {record.phase === 'Succeeded' && <Completed />}
            {record.phase === 'pending' && <Pending />}
            {record.phase === 'running' && <Running />}
            {record.phase === 'Failed' && <Failed />}

            {record.phase}
          </>
        )
      },
      sorter: (a, b) => {return a.phase.localeCompare(b.phase)},
    },
    {
      title: 'Date/ Time Submitted',
      key: 'DateTimeSubmitted',
      render: (record) => {
        return (
          `item.DateTimeSubmitted missing at ${new Date().toLocaleString()}`
        )},
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      render: (record) => {
        return (
          <Space>
            <Button
            onClick={() => {
              setSelectedRowData({
                uid: record.uid,
                name: record.name,
              });
              setCurrentView('execution');
            }}
          >
            Execution
          </Button>
          <Button
            onClick={() => {
              setSelectedRowData({
                uid: record.uid,
                name: record.name,
              });
              setCurrentView('results');
            }}
          >
            Results
          </Button>
        </Space>
      )},
    },
    {
      title: 'Actions',
      key: 'actions',
      render:  (record) => {
        return (
          /*<Dropdown menu={{ dropDownItems }}>
            <a onClick={(e) => e.preventDefault()}>
              <EllipsisOutlined />
            </a>
          </Dropdown>*/<>Fix Commented code, causes runtime err on click</>
        )
      }
    },
  ];

  return (
    <div className='home-table'>
      <Table
        dataSource={[...data]}
        columns={columns}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
      />
    </div>
  );
};
HomeTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HomeTable;
