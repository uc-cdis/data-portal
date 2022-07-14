import React from 'react';
import { useQuery } from 'react-query';
import { Table } from 'antd';
import { covariateTableConfig, covariateSelection } from './constants';
import { fetchCovariates, queryConfig } from '../wizard-endpoints/cohort-middleware-api';
import Spinner from '../../../components/Spinner';
import '../../GWASUIApp/GWASUIApp.css';
import { useFetch, useFilter } from "./form-hooks";

const Covariates = ({ sourceId, searchTerm, selectedCovariates, handleCovariateSelect }) => {
    const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);
    const fetchedCovariates = useFetch(covariates, "concepts");
    const displayedCovariates = useFilter(fetchedCovariates, searchTerm, "concept_name");

    return (<>
        {(covariates?.status === 'success') ? (
            <Table
                className='GWASUI-table2'
                rowKey='concept_id'
                size='middle'
                pagination={{ pageSize: 10 }}
                rowSelection={covariateSelection(handleCovariateSelect, selectedCovariates)}
                columns={covariateTableConfig}
                dataSource={displayedCovariates}
            />
        ) : <Spinner />
    }</>)

};


export default Covariates;
