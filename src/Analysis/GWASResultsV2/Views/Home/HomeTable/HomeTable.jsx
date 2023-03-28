import React, { useContext } from 'react';
import { Button, Table, Space } from 'antd';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';
import ActionsDropdown from './ActionsDropdown/ActionsDropdown';
import Icons from './TableIcons/Icons';
import './HomeTable.css';

const HomeTable = ({ data }) => {
  const { setCurrentView, setSelectedRowData } = useContext(SharedContext);
  const columns = [
    {
      title: 'Run ID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => a.uid.localeCompare(b.uid),
    },
    {
      title: 'Workflow name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Date/Time Started',
      dataIndex: 'startedAt',
      key: 'startedAt',
      sorter: (a, b) => a.startedAt.localeCompare(b.startedAt),
    },
    {
      title: 'Job status',
      key: 'phase',
      render: (record) => (
        <div className='job-status'>
          {record.phase === 'Succeeded' && <Icons.Succeeded />}
          {record.phase === 'Pending' && <Icons.Pending />}
          {record.phase === 'Running' && <Icons.Running />}
          {record.phase === 'Error' && <Icons.Error />}
          {record.phase === 'Failed' && <Icons.Failed />}
          {record.phase}
        </div>
      ),
      sorter: (a, b) => a.phase.localeCompare(b.phase),
    },
    {
      title: 'Date/Time Submitted',
      key: 'DateTimeSubmitted',
      render: (record) => record.DateTimeSubmitted
        || `item.DateTimeSubmitted missing at ${new Date().toLocaleString()}`,
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      render: (record) => (
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
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <ActionsDropdown />,
    },
  ];

  return (
    <div className='home-table'>
      <Table
        dataSource={[...data]}
        columns={columns}
        rowKey={(record) => record.uid}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
    </div>
  );
};
HomeTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HomeTable;
