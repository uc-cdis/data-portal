import React, { useContext } from 'react';
import { Button, Table, Space, Input, DatePicker, Select } from 'antd';
const { RangePicker } = DatePicker;
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';
import ActionsDropdown from './ActionsDropdown/ActionsDropdown';
import Icons from './TableIcons/Icons';
import DateForTable from '../../../SharedComponents/DateForTable/DateForTable';
import PHASES from '../../../Utils/PhasesEnumeration';
import './HomeTable.css';

const HomeTable = ({ data }) => {
  const { setCurrentView, setSelectedRowData } = useContext(SharedContext);
  const initial = {
    key: 'initial',
    uid: 'initial',
    wf_name: 'initial',
    submittedAt: 'initial',
    startedAt: 'initial',
    phase: 'initial',
  };

  const columns = [
    {
      title: 'Run ID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => a.uid.localeCompare(b.uid),
      render: (value) =>
        value === 'initial' ? (
          <Input placeholder='Search by Run ID' suffix={<SearchOutlined />} />
        ) : (
          value
        ),
    },
    {
      title: 'Workflow name',
      dataIndex: 'wf_name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) =>
        value === 'initial' ? (
          <Input
            placeholder='Search by Workflow Name'
            suffix={<SearchOutlined />}
          />
        ) : (
          value
        ),
    },
    {
      title: 'Date/Time Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => a.startedAt.localeCompare(b.submittedAt),
      render: (value) =>
        value === 'initial' ? (
          <RangePicker />
        ) : (
          <DateForTable utcFormattedDate={value} />
        ),
    },
    {
      title: 'Job status',
      dataIndex: 'phase',
      key: 'phase',
      render: (value) =>
        value === 'initial' ? (
          <Select
            defaultValue='lucy'
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'Yiminghe',
                label: 'yiminghe',
              },
              {
                value: 'disabled',
                label: 'Disabled',
                disabled: true,
              },
            ]}
          />
        ) : (
          <div className='job-status'>
            {value === PHASES.Succeeded && <Icons.Succeeded />}
            {value === PHASES.Pending && <Icons.Pending />}
            {value === PHASES.Running && <Icons.Running />}
            {value === PHASES.Error && <Icons.Error />}
            {value === PHASES.Failed && <Icons.Failed />}
            {value}
          </div>
        ),
      sorter: (a, b) => a.phase.localeCompare(b.phase),
    },
    {
      title: 'Date/Time Started',
      key: 'startedAt',
      sorter: (a, b) => a.startedAt.localeCompare(b.startedAt),
      render: (record) => <DateForTable utcFormattedDate={record.startedAt} />,
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      render: (record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedRowData(record);
              setCurrentView('execution');
            }}
          >
            Execution
          </Button>
          <Button
            onClick={() => {
              setSelectedRowData(record);
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
      render: (record) => <ActionsDropdown record={record} />,
    },
  ];
  return (
    <div className='home-table'>
      <Table
        dataSource={[initial, ...data]}
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
