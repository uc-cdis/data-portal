import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import { covariateTableConfig, covariateSelection } from './constants';
import { fetchCovariates, queryConfig } from '../wizard-endpoints/cohort-middleware-api';
import '../../GWASUIApp/GWASUIApp.css';
import { useFetch, useFilter } from './form-hooks';

const Covariates = ({
  sourceId, searchTerm, selectedCovariates, handleCovariateSelect,
}) => {
  const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);
  const fetchedCovariates = useFetch(covariates, 'concepts');
  const displayedCovariates = useFilter(fetchedCovariates, searchTerm, 'concept_name');

  return (
    <React.Fragment>
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
      ) : <div className='GWASUI-spinnerContainer GWASUI-emptyTable'><Spin /></div>}
    </React.Fragment>
  );
};

Covariates.propTypes = {
  sourceId: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  handleCovariateSelect: PropTypes.func.isRequired,
};

export default Covariates;
