import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import { covariateTableConfig, covariateSelection } from './constants';
import { fetchCovariates, queryConfig } from '../wizardEndpoints/cohortMiddlewareApi';
import '../../GWASUIApp/GWASUIApp.css';
import { useFetch, useFilter } from './formHooks';

const Covariates = ({
  sourceId, searchTerm, selectedCovariates, handleCovariateSelect,
}) => {
  const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);
  const fetchedCovariates = useFetch(covariates, 'concepts');
  const displayedCovariates = useFilter(fetchedCovariates, searchTerm, 'concept_name');

  if (covariates?.status === 'loading') {
    return (
      <React.Fragment>
        <div className='GWASUI-spinnerContainer GWASUI-emptyTable'>
          <Spin />
        </div>
      </React.Fragment>
    );
  }

  if (covariates?.status === 'error') {
    return (
      <React.Fragment>
        <div className='GWASUI-spinnerContainer GWASUI-emptyTable'>
          <span>Error!</span>
        </div>
      </React.Fragment>
    );
  }

  if (covariates?.status === 'success') {
    return (
      <Table
        className='GWASUI-table2'
        rowKey='concept_id'
        size='middle'
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '500'] }}
        rowSelection={covariateSelection(handleCovariateSelect, selectedCovariates)}
        columns={covariateTableConfig}
        dataSource={displayedCovariates}
      />
    );
  }
  return <React.Fragment />;
};

Covariates.propTypes = {
  sourceId: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  handleCovariateSelect: PropTypes.func.isRequired,
};

export default Covariates;
