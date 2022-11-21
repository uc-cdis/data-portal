import React from 'react';
// import '../GWASCovariates.css';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import {
  fetchCovariates,
  queryConfig,
} from '../wizardEndpoints/cohortMiddlewareApi';
import { useFetch } from '../formHooks';
import { useSourceContext } from '../Source';

const Covariates = ({
  // searchTerm,
  selected,
  handleSelect,
}) => {
  const { source } = useSourceContext();
  const covariates = useQuery(
    ['covariates', source],
    () => fetchCovariates(source),
    queryConfig
  );
  const fetchedCovariates = useFetch(covariates, 'concepts');
  // const displayedCovariates = useFilter(fetchedCovariates, searchTerm, 'concept_name');

  const covariateSelection = () => ({
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: selected ? [selected.concept_id] : [],
    onChange: (_, selectedRows) => {
      handleSelect(selectedRows[0]);
    },
  });

  const covariateTableConfig = [
    {
      title: 'Concept ID',
      dataIndex: 'concept_id',
      key: 'concept_name',
    },
    {
      title: 'Concept Name',
      dataIndex: 'concept_name',
      key: 'concept_name',
      filterSearch: true,
    },
  ];

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
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '500'],
        }}
        rowSelection={covariateSelection()}
        columns={covariateTableConfig}
        dataSource={fetchedCovariates}
      />
    );
  }
  return <React.Fragment />;
};

Covariates.propTypes = {
  // searchTerm: PropTypes.string.isRequired,
  selected: PropTypes.any,
  handleSelect: PropTypes.func.isRequired,
  // type: Proptypes.string.isRequired
};

export default Covariates;
