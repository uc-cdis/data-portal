import React, { useContext, useState } from 'react';
import { Button, Table, Space, Input, DatePicker, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
  const {
    setCurrentView,
    setSelectedRowData,
    nameSearchTerm,
    setNameSearchTerm,
    wfNameSearchTerm,
    setWfNameSearchTerm,
    submittedAtSelections,
    setSubmittedAtSelections,
    startedAtSelections,
    setStartedAtSelections,
    jobStatusSelections,
    setJobStatusSelections,
    sortInfo,
    setSortInfo,
    currentPage,
    setCurrentPage,
  } = useContext(SharedContext);

  const handleTableChange = (pagination, filters, sorter) => {
    setSortInfo(sorter);
    setCurrentPage(pagination.current);
    console.log('Sort Info', sortInfo);
    console.log('currentPage', currentPage);
  };

  const handleSearchTermChange = (event, searchTermKey) => {
    setCurrentPage(1);
    if (searchTermKey === 'name') {
      setNameSearchTerm(event.target.value);
    }
    if (searchTermKey === 'wf_name') {
      setWfNameSearchTerm(event.target.value);
    }
  };

  const handleDateSelectionChange = (event, dateType) => {
    setCurrentPage(1);
    if (dateType === 'submittedAtSelection') {
      if (event && event.length === 2) {
        const startDate = moment.utc(event[0]._d);
        const endDate = moment.utc(event[1]._d);
        return setSubmittedAtSelections([startDate, endDate]);
      } else {
        return setSubmittedAtSelections([]);
      }
    }
    if (dateType === 'startedAtSelection') {
      if (event && event.length === 2) {
        const startDate = moment.utc(event[0]._d);
        const endDate = moment.utc(event[1]._d);
        setStartedAtSelections([startDate, endDate]);
      } else {
        setStartedAtSelections([]);
      }
    }
  };

  const handleJobStatusChange = (event) => {
    setCurrentPage(1);
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortInfo.columnKey === 'name' && sortInfo.order,
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
      key: 'wf_name',
      sorter: (a, b) => a.wf_name.localeCompare(b.wf_name),
      sortOrder: sortInfo.columnKey === 'wf_name' && sortInfo.order,
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
      sortOrder: sortInfo.columnKey === 'submittedAt' && sortInfo.order,
      children: [
        {
          title: (
            <RangePicker
              popupClassName='home-table-range-picker'
              value={submittedAtSelections}
              allowClear
              size='large'
              onChange={(event) => {
                handleDateSelectionChange(event, 'submittedAtSelection');
              }}
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
      sortOrder: sortInfo.columnKey === 'phase' && sortInfo.order,
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
      sortOrder: sortInfo.columnKey === 'startedAt' && sortInfo.order,
      dataIndex: 'startedAt',
      children: [
        {
          title: (
            <Space direction='vertical' size={12}>
              <RangePicker
                value={startedAtSelections}
                popupClassName='home-table-range-picker'
                allowClear
                size='large'
                onChange={(event) => {
                  handleDateSelectionChange(event, 'startedAtSelection');
                }}
              />
            </Space>
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

  const filterByJobStatuses = (initData) =>
    initData.filter((item) => jobStatusSelections.includes(item.phase));

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
        onChange={handleTableChange}
        defaultCurrent={6}
        pagination={{
          current: currentPage,
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
