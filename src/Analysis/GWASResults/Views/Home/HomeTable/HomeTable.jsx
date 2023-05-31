import React, { useContext, useEffect, useState } from 'react';
import {
  Button, Table, Space, Input, DatePicker, Select,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import SharedContext from '../../../Utils/SharedContext';
import ActionsDropdown from './ActionsDropdown/ActionsDropdown';
import Icons from './TableIcons/Icons';
import DateForTable from '../../../SharedComponents/DateForTable/DateForTable';
import PHASES from '../../../Utils/PhasesEnumeration';
import filterTableData from './filterTableData';
import VIEWS from '../../../Utils/ViewsEnumeration';
import isIterable from '../../../Utils/isIterable';
import LoadingErrorMessage from '../../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';
import './HomeTable.css';

const { RangePicker } = DatePicker;

const HomeTable = ({ data }) => {
  const {
    setCurrentView,
    setSelectedRowData,
    homeTableState,
    setHomeTableState,
  } = useContext(SharedContext);

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current !== homeTableState.currentPage) {
      // User changes page selection, set page to current pagination selection
      return setHomeTableState({
        ...homeTableState,
        currentPage: pagination.current,
      });
    }
    // When the user updates sorting set page to first page
    return setHomeTableState({
      ...homeTableState,
      currentPage: 1,
      sortInfo: sorter,
    });
  };

  const handleSearchTermChange = (event, searchTermKey) => {
    if (searchTermKey === 'name') {
      setHomeTableState({
        ...homeTableState,
        currentPage: 1,
        nameSearchTerm: event.target.value,
      });
    }
    if (searchTermKey === 'wf_name') {
      setHomeTableState({
        ...homeTableState,
        currentPage: 1,
        wfNameSearchTerm: event.target.value,
      });
    }
  };

  const handleDateSelectionChange = (event, dateType) => {
    if (dateType === 'submittedAtSelection') {
      if (event && event.length === 2) {
        const startDate = moment.utc(event[0]._d);
        const endDate = moment.utc(event[1]._d);
        return setHomeTableState({
          ...homeTableState,
          currentPage: 1,
          submittedAtSelections: [startDate, endDate],
        });
      }
      return setHomeTableState({
        ...homeTableState,
        currentPage: 1,
        submittedAtSelections: [],
      });
    }
    if (dateType === 'finishedAtSelection') {
      if (event && event.length === 2) {
        const startDate = moment.utc(event[0]._d);
        const endDate = moment.utc(event[1]._d);
        return setHomeTableState({
          ...homeTableState,
          currentPage: 1,
          finishedAtSelections: [startDate, endDate],
        });
      }
      return setHomeTableState({
        ...homeTableState,
        currentPage: 1,
        finishedAtSelections: [],
      });
    }
    return new Error('Invalid dateType');
  };

  const handleJobStatusChange = (event) => {
    setHomeTableState({
      ...homeTableState,
      currentPage: 1,
      jobStatusSelections: event,
    });
  };

  const jobStatusDropdownOptions = [];
  Object.values(PHASES).forEach((phase) => jobStatusDropdownOptions.push({ value: phase, label: phase }),
  );

  const columns = [
    {
      title: 'Run ID',
      dataIndex: 'name',
      key: 'name',
      show: homeTableState.columnManagement.showRunId,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder:
        homeTableState.sortInfo?.columnKey === 'name'
        && homeTableState.sortInfo.order,
      children: [
        {
          title: (
            <Input
              placeholder='Search by Run ID'
              value={homeTableState.nameSearchTerm}
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
      show: homeTableState.columnManagement.showWorkflowName,
      sorter: (a, b) => a.wf_name.localeCompare(b.wf_name),
      sortOrder:
        homeTableState.sortInfo?.columnKey === 'wf_name'
        && homeTableState.sortInfo.order,
      children: [
        {
          title: (
            <Input
              placeholder='Search by Workflow Name'
              suffix={<SearchOutlined />}
              value={homeTableState.wfNameSearchTerm}
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
      show: homeTableState.columnManagement.showDateSubmitted,
      sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
      sortOrder:
        homeTableState.sortInfo?.columnKey === 'submittedAt'
        && homeTableState.sortInfo.order,
      children: [
        {
          title: (
            <RangePicker
              popupClassName='home-table-range-picker'
              value={homeTableState.submittedAtSelections}
              allowClear
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
      show: homeTableState.columnManagement.showJobStatus,
      sortOrder:
        homeTableState.sortInfo?.columnKey === 'phase'
        && homeTableState.sortInfo.order,
      children: [
        {
          title: (
            <Select
              showArrow
              className='select-job-status'
              placeholder='Select Job Status'
              mode='multiple'
              options={jobStatusDropdownOptions}
              value={homeTableState.jobStatusSelections}
              onChange={(event) => handleJobStatusChange(event)}
            />
          ),
          dataIndex: 'phase',
          render: (value) => (
            <div className='job-status'>
              {value === PHASES.Succeeded && <Icons.Succeeded />}
              {value === PHASES.Pending && <Icons.Pending />}
              {value === PHASES.Running && <Icons.Running />}
              {value === PHASES.Error && <Icons.Error />}
              {value === PHASES.Failed && <Icons.Failed />}
              {value}
            </div>
          ),
        },
      ],
      sorter: (a, b) => a.phase.localeCompare(b.phase),
    },
    {
      title: 'Date/Time Finished',
      key: 'finishedAt',
      show: homeTableState.columnManagement.showDateFinished,
      sorter: (a, b) => a.finishedAt.localeCompare(b.finishedAt),
      sortOrder:
        homeTableState.sortInfo?.columnKey === 'finishedAt'
        && homeTableState.sortInfo.order,
      dataIndex: 'finishedAt',
      children: [
        {
          title: (
            <RangePicker
              value={homeTableState.finishedAtSelections}
              popupClassName='home-table-range-picker'
              allowClear
              onChange={(event) => {
                handleDateSelectionChange(event, 'finishedAtSelection');
              }}
            />
          ),
          dataIndex: 'finishedAt',
          render: (value) => <DateForTable utcFormattedDate={value} />,
        },
      ],
    },
    {
      title: 'View Details',
      key: 'viewDetails',
      show: homeTableState.columnManagement.showViewDetails,
      children: [
        {
          title: '',
          render: (record) => (
            <Space>
              <Button
                onClick={() => {
                  setSelectedRowData(record);
                  setCurrentView(VIEWS.input);
                }}
              >
                Input
              </Button>
              <Button
                onClick={() => {
                  setSelectedRowData(record);
                  setCurrentView(VIEWS.execution);
                }}
              >
                Execution
              </Button>
              <Button
                onClick={() => {
                  setSelectedRowData(record);
                  setCurrentView(VIEWS.results);
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
      show: homeTableState.columnManagement.showActions,
      children: [
        {
          title: '',
          render: (record) => <ActionsDropdown record={record} />,
        },
      ],
    },
  ].filter((item) => item.show);

  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    setFilteredData(filterTableData(data, homeTableState));
  }, [homeTableState, data]);

  const checkForShownColumn = () => Object.values(homeTableState.columnManagement).includes(true);

  return (
    <div className='home-table'>
      {checkForShownColumn() ? (
        <Table
          dataSource={isIterable(filteredData) && [...filteredData]}
          columns={columns}
          rowKey={(record) => record.uid}
          onChange={handleTableChange}
          pagination={{
            current: homeTableState.currentPage,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
          }}
        />
      ) : (
        <LoadingErrorMessage message='Please select at least one column from Manage columns' />
      )}
    </div>
  );
};
HomeTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HomeTable;
