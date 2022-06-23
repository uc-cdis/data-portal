import React, { useEffect, useState } from 'react';
import { fetchCohortDefinitions, queryConfig } from "../wizard-endpoints/cohort-middleware-api";
import { useQuery } from 'react-query';
import { Spinner } from "../../../components/Spinner";
import { Space, Table, Popover } from 'antd';
import { cohortTableConfig } from './constants';

const CohortDefinitions = ({ sourceId, selectedCohort, handleCohortSelect }) => {
    const cohorts = useQuery(['cohortdefinitions', sourceId], () => fetchCohortDefinitions(sourceId), queryConfig);
    const step1TableRowSelection = {
        type: 'radio',
        columnTitle: 'Select',
        selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
        onChange: (_, selectedRows) => {
            handleCohortSelect(selectedRows[0]);
        },
        getCheckboxProps: (record) => ({
            disabled: record.size === 0,
        }),
    };

    return (cohorts ? (
        (cohorts.status === 'success') ? (<Table
            className='GWASUI-table1'
            rowKey='cohort_definition_id'
            size='middle'
            pagination={{ pageSize: 10 }}
            rowSelection={step1TableRowSelection}
            columns={cohortTableConfig}
            dataSource={cohorts.data.cohort_definitions_and_stats} // many entries w/ size 0 in prod .filter((x) => x.size > 0)
        />) : <span>Something went wrong.</span>
    )
        : <Spinner />)
};

export default CohortDefinitions;
