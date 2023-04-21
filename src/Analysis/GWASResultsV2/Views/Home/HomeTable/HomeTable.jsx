import React, { useContext, useState } from 'react';
import { Button, Table, Space, Input, DatePicker, Select } from 'antd';
import { SearchOutlined, CaretDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import SharedContext from '../../../Utils/SharedContext';
import ActionsDropdown from './ActionsDropdown/ActionsDropdown';
import Icons from './TableIcons/Icons';
import DateForTable from '../../../SharedComponents/DateForTable/DateForTable';
import PHASES from '../../../Utils/PhasesEnumeration';
import './HomeTable.css';

const { RangePicker } = DatePicker;

const HomeTable = ({ data }) => {
  const { setCurrentView, setSelectedRowData } = useContext(SharedContext);
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [wfNameSearchTerm, setWfNameSearchTerm] = useState('');
  const [submittedAtSelections, setSubmittedAtSelections] = useState([]);
  const [startedAtSelections, setStartedAtSelections] = useState([]);
  const [jobStatusSelections, setJobStatusSelections] = useState([]);

  const handleSearchTermChange = (event, searchTermKey) => {
    if (searchTermKey === 'name') {
      setNameSearchTerm(event.target.value);
    }
    if (searchTermKey === 'wf_name') {
      setWfNameSearchTerm(event.target.value);
    }
  };

  const handleDateSelectionChange = (event, dateType) => {
    const startDate = moment.utc(event[0]._d);
    const endDate = moment.utc(event[1]._d);
    if (dateType === 'submittedAt') {
      setSubmittedAtSelections([startDate, endDate]);
    }
    if (dateType === 'startedAt') {
      setStartedAtSelections([startDate, endDate]);
    }
  };

  const handleJobStatusChange = (event) => {
    console.log(event);
    setJobStatusSelections(event);
  };

  const phaseOptions = [];
  Object.values(PHASES).forEach((phase) =>
    phaseOptions.push({ value: phase, label: phase })
  );

  const columns = [
    {
      title: 'Run ID',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      children: [
        {
          title: (
            <Input
              placeholder='Search by Run ID'
              value={nameSearchTerm}
              onChange={(event) => handleSearchTermChange(event, 'name')}
              suffix={<SearchOutlined />}
            />
          ),
          dataIndex: 'name',
        },
      ],
    },
    {
      title: 'Workflow name',
      dataIndex: 'wf_name',
      key: 'name',
      sorter: (a, b) => {
        return a.wf_name.localeCompare(b.wf_name);
      },
      children: [
        {
          title: (
            <Input
              placeholder='Search by Workflow Name'
              suffix={<SearchOutlined />}
              vale={wfNameSearchTerm}
              onChange={(event) => handleSearchTermChange(event, 'wf_name')}
            />
          ),
          dataIndex: 'wf_name',
        },
      ],
    },

    {
      title: 'Date/Time Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
      children: [
        {
          title: (
            <RangePicker
              showToday
              onChange={(event) =>
                event !== null &&
                handleDateSelectionChange(event, 'submittedAt')
              }
            />
          ),
          dataIndex: 'submittedAt',
          render: (value) => <DateForTable utcFormattedDate={value} />,
        },
      ],
    },
    {
      title: 'Job status',
      dataIndex: 'phase',
      key: 'phase',
      children: [
        {
          title: (
            <Select
              showArrow
              placeholder='Select Job Status'
              mode='multiple'
              style={{
                width: '100%',
              }}
              options={phaseOptions}
              value={jobStatusSelections}
              onChange={(event) => handleJobStatusChange(event)}
            />
          ),
          dataIndex: 'phase',
          render: (value) => {
            console.log(value);
            return (
              <div className='job-status'>
                {value === PHASES.Succeeded && <Icons.Succeeded />}
                {value === PHASES.Pending && <Icons.Pending />}
                {value === PHASES.Running && <Icons.Running />}
                {value === PHASES.Error && <Icons.Error />}
                {value === PHASES.Failed && <Icons.Failed />}
                {value}
              </div>
            );
          },
        },
      ],

      sorter: (a, b) => {
        if (a.phase === 'initial' || b.phase === 'initial') return 0;
        return a.phase.localeCompare(b.phase);
      },
    },
    {
      title: 'Date/Time Started',
      key: 'startedAt',
      sorter: (a, b) => a.startedAt.localeCompare(b.startedAt),

      dataIndex: 'startedAt',

      children: [
        {
          title: (
            <RangePicker
              showToday
              onChange={(event) =>
                event !== null && handleDateSelectionChange(event, 'startedAt')
              }
            />
          ),
          dataIndex: 'startedAt',
          render: (value) => <DateForTable utcFormattedDate={value} />,
        },
      ],
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      children: [
        {
          title: '',
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
      ],
    },
    {
      title: 'Actions',
      key: 'actions',
      children: [
        {
          title: '',
          render: (record) => <ActionsDropdown record={record} />,
        },
      ],
    },
  ];

  const filterBySearchTerm = (initData, key, searchTerm) =>
    initData.filter((obj) =>
      obj[key]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const filterByJobStatuses = (initData) => {
    return initData.filter((item) => jobStatusSelections.includes(item.phase));
  };

  const filterByDateRange = (initData, key, dateSelection) =>
    initData.filter((obj) => {
      const utcDate = moment.utc(obj[key]);
      return (
        utcDate.isSameOrAfter(dateSelection[0]) &&
        utcDate.isSameOrBefore(dateSelection[1])
      );
    });

  const filteredData = () => {
    let filteredDataResult = data;
    if (nameSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'name',
        nameSearchTerm
      );
    }
    if (wfNameSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'wf_name',
        wfNameSearchTerm
      );
    }
    if (submittedAtSelections.length > 0) {
      filteredDataResult = filterByDateRange(
        filteredDataResult,
        'submittedAt',
        submittedAtSelections
      );
    }
    if (jobStatusSelections.length > 0) {
      filteredDataResult = filterByJobStatuses(filteredDataResult);
    }
    if (startedAtSelections.length > 0) {
      filteredDataResult = filterByDateRange(
        filteredDataResult,
        'startedAt',
        startedAtSelections
      );
    }

    return filteredDataResult;
  };
  return (
    <div className='home-table'>
      <Table
        dataSource={filteredData()}
        columns={columns}
        rowKey={(record) => record.name}
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
