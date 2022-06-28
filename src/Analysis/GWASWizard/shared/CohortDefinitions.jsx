import React from 'react';
import { fetchCohortDefinitions, queryConfig } from "../wizard-endpoints/cohort-middleware-api";
import { useQuery } from 'react-query';
import { Spinner } from "../../../components/Spinner";
import { Space, Table, Popover } from 'antd';
import { cohortTableConfig, cohortSelection } from './constants';

const CohortDefinitions = ({ sourceId, selectedCohort, handleCohortSelect, caseSelected }) => {
    const cohorts = useQuery(['cohortdefinitions', sourceId], () => fetchCohortDefinitions(sourceId), queryConfig);

    return (cohorts ? (
        (cohorts.status === 'success') ? (<Table
            className='GWASUI-table1'
            rowKey='cohort_definition_id'
            size='middle'
            pagination={{ pageSize: 10 }}
            rowSelection={cohortSelection(handleCohortSelect, selectedCohort, caseSelected)}
            columns={cohortTableConfig}
            dataSource={cohorts.data.cohort_definitions_and_stats} // many entries w/ size 0 in prod .filter((x) => x.size > 0)
        />) : <span>Something went wrong.</span>
    )
        : <Spinner />)
};

export default CohortDefinitions;
