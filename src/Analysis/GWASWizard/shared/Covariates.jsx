import React from 'react';
import { covariateTableConfig, covariateSelection } from './constants';
import { fetchCovariates, queryConfig } from "../wizard-endpoints/cohort-middleware-api";
import { useQuery } from 'react-query';
import { Table } from 'antd';
import { Spinner } from "../../../components/Spinner";

const Covariates = ({ sourceId, searchTerm, selectedCovariates, handleCovariateSelect, page, handlePage }) => {
    const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);

    return (<>{covariates ? (
        (covariates.status === 'success') ? (
            // covariates.data && covariates.data.concepts.length > 0 ?
            <Table
                className='GWASUI-table2'
                rowKey='concept_id'
                pagination={{ pageSize: 10, onChange: (e) => handlePage(e), current: page }}
                rowSelection={covariateSelection(handleCovariateSelect, selectedCovariates)}
                columns={covariateTableConfig}
                //.filter((cov) => cov.concept_name.toLowerCase().includes(searchTerm.toLowerCase()))
                dataSource={covariates.data.concepts}
            />) : <span>is loading</span>) : <React.Fragment>Unexpected error: no convariates found!</React.Fragment>}</>)
}

export default Covariates;
