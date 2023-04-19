import React, { useContext, useState } from 'react';
import { Button, Table, Space, Input, DatePicker, Select } from 'antd';
import { SearchOutlined, CaretDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import SharedContext from '../../../Utils/SharedContext';
import ActionsDropdown from './ActionsDropdown/ActionsDropdown';
import Icons from './TableIcons/Icons';
import DateForTable from '../../../SharedComponents/DateForTable/DateForTable';
import PHASES from '../../../Utils/PhasesEnumeration';
import './HomeTable.css';

const { RangePicker } = DatePicker;

const HomeTable = ({ data }) => {
  const { setCurrentView, setSelectedRowData } = useContext(SharedContext);

  const [runIdSearchTerm, setRunIdSearchTerm] = useState('');
  const handleRunIdSearchTermChange = (event) => {
    setRunIdSearchTerm(event.target.value);
  };
  const initial = {
    key: 'initial',
    name: 'initial',
    uid: 'initial',
    wf_name: 'initial',
    submittedAt: 'initial',
    startedAt: 'initial',
    phase: 'initial',
    viewDetails: 'initial',
    actions: 'initial',
  };

  const emptyTableData = {
    key: 'No Results',
    name: 'No Results',
    uid: 'No Results',
    wf_name: 'No Results',
    submittedAt: 'No Results',
    startedAt: 'No Results',
    phase: 'No Results',
    viewDetails: 'initial',
    actions: 'initial',
  };

  const columns = [
    {
      title: 'Run ID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => {
        if (a.uid === 'initial' || b.uid === 'initial') return 0;
        return a.uid.localeCompare(b.uid);
      },
      render: (value) =>
        value === 'initial' ? (
          <Input
            placeholder='Search by Run ID'
            value={runIdSearchTerm}
            onChange={handleRunIdSearchTermChange}
            suffix={<SearchOutlined />}
          />
        ) : (
          value
        ),
    },
    {
      title: 'Workflow name',
      dataIndex: 'wf_name',
      key: 'name',
      sorter: (a, b) => {
        if (a.name === 'initial' || b.name === 'initial') return 0;
        return a.wf_name.localeCompare(b.wf_name);
      },
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
      // sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
      sorter: (a, b) => {
        if (a.submittedAt === 'initial' || b.submittedAt === 'initial')
          return 0;
        return a.submittedAt.localeCompare(b.submittedAt);
      },
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
            showArrow
            suffixIcon={<CaretDownOutlined />}
            mode='multiple'
            style={{
              width: '100%',
            }}
            options={[
              {
                value: 'Succeeded',
                label: 'Succeeded',
              },
              {
                value: 'Pending',
                label: 'Pending',
              },
              {
                value: 'Running',
                label: 'Running',
              },
              {
                value: 'Error',
                label: 'Error',
              },
              {
                value: 'Failed',
                label: 'Failed',
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
      sorter: (a, b) => {
        if (a.phase === 'initial' || b.phase === 'initial') return 0;
        return a.phase.localeCompare(b.phase);
      },
    },
    {
      title: 'Date/Time Started',
      key: 'startedAt',
      // sorter: (a, b) => a.startedAt.localeCompare(b.startedAt),
      sorter: (a, b) => {
        if (a.startedAt === 'initial' || b.startedAt === 'initial') return 0;
        return a.startedAt.localeCompare(b.startedAt);
      },

      dataIndex: 'startedAt',
      render: (value) =>
        value === 'initial' ? (
          <RangePicker />
        ) : (
          <DateForTable utcFormattedDate={value} />
        ),
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      render: (record) =>
        record.viewDetails === 'initial' ? (
          ''
        ) : (
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
      render: (record) =>
        record.actions === 'initial' ? '' : <ActionsDropdown record={record} />,
    },
  ];

  const filterRunId = (initData, key, searchTerm) => {
    return initData.filter((obj) => {
      return obj[key]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  };
  const filteredData = () => {
    let filteredDataResult = data;
    filteredDataResult = filterRunId(
      filteredDataResult,
      'uid',
      runIdSearchTerm
    );
    console.log('processed filteredDataResult', filteredDataResult);
    return filteredDataResult;
  };
  return (
    <div className='home-table'>
      <Table
        dataSource={
          filteredData().length > 0
            ? [initial, ...filteredData()]
            : [initial, ...[emptyTableData]]
        }
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
