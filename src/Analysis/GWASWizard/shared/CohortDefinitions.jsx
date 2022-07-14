import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Space, Table, Popover } from 'antd';
import { fetchCohortDefinitions, queryConfig } from '../wizard-endpoints/cohort-middleware-api';
import Spinner from '../../../components/Spinner';
import { cohortTableConfig, cohortSelection } from './constants';
import '../../GWASUIApp/GWASUIApp.css';
import { useFetch, useFilter } from "./form-hooks";


const CohortDefinitions = ({
    sourceId, selectedCohort, handleCohortSelect, otherCohortSelected, searchTerm
}) => {
    const cohorts = useQuery(['cohortdefinitions', sourceId], () => fetchCohortDefinitions(sourceId), queryConfig);
    const fetchedCohorts = useFetch(cohorts, "cohort_definitions_and_stats");
    const displayedCohorts = useFilter(fetchedCohorts, searchTerm, "cohort_name");

    return (cohorts ? (
        (cohorts.status === 'success') ? (
            <Table
                className='GWASUI-table1'
                rowKey='cohort_definition_id'
                size='middle'
                pagination={{ pageSize: 10 }}
                rowSelection={cohortSelection(handleCohortSelect, selectedCohort, otherCohortSelected)}
                columns={cohortTableConfig}
                dataSource={displayedCohorts}
            />
        ) : <span>Something went wrong.</span>
    )
        : <Spinner />);
};

export default CohortDefinitions;
