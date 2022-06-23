import React from 'react';
import { covariateTableConfig, covariateSelection } from './constants';
import { fetchCovariates, queryConfig } from "../wizard-endpoints/cohort-middleware-api";
import { useQuery } from 'react-query';
import { Spinner } from "../../../components/Spinner";

const Covariates = ({ sourceId, searchTerm, selectedCovariates, handleCovariateSelect, page, handlePage }) => {
    const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);

    if (covariates.status === 'loading') {
        return <Spinner />;
    }
    if (covariates.status === 'error') {
        return <React.Fragment>Error</React.Fragment>;
    }

    return (covariates ? (
        (covariates.status === 'success') ? (
            (covariates.data && covariates.data.concepts.length > 0 ? (<Table
                className='GWASUI-table2'
                rowKey='concept_id'
                pagination={{ pageSize: 10, onChange: (e) => handlePage(e), current: page }}
                rowSelection={covariateSelection(handleCovariateSelect, selectedCovariates)}
                columns={covariateTableConfig}
                dataSource={covariates.data.concepts.filter((cov) => cov.concept_name.toLowerCase().includes(searchTerm.toLowerCase()))}
            />) : <React.Fragment>Unexpected error: no convariates found!</React.Fragment>)) : <span>Failed request</span>) : <Spinner />)
}

export default Covariates;
