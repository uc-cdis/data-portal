import React from 'react';
import './../GWASCovariates.css';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import { fetchCovariates, queryConfig  } from "../../wizardEndpoints/cohortMiddlewareApi";
import { useFetch, useFilter } from "../../formHooks";


const Covariates = ({
  sourceId,
  // searchTerm,
  selectedCovariates,
  handleCovariateSelect,
}) => {
  const covariates = useQuery(['covariates', sourceId], () => fetchCovariates(sourceId), queryConfig);
  const fetchedCovariates = useFetch(covariates, 'concepts');
  // const displayedCovariates = useFilter(fetchedCovariates, searchTerm, 'concept_name');

  const covariateSelection = (handler, selected) => ({
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: (selected) ? [selected.concept_id] : [],
    onChange: (_, selectedRows) => {
      handler(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
        disabled: record.size === 0 // || selected.some((a) => a.concept_id === record.concept_id)
      }),
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
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '500'] }}
        rowSelection={covariateSelection(handleCovariateSelect, selectedCovariates)}
        columns={covariateTableConfig}
        dataSource={fetchedCovariates}
      />
    );
  }
  return <React.Fragment />;
};

Covariates.propTypes = {
  sourceId: PropTypes.number.isRequired,
  // searchTerm: PropTypes.string.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  handleCovariateSubmit: PropTypes.func.isRequired
};

export default Covariates;
