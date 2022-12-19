import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import { fetchCovariates, queryConfig } from '../../Utils/cohortMiddlewareApi';
import { useFetch, useFilter } from '../../Utils/formHooks';
import { useSourceContext } from '../../Utils/Source';
import SearchBar from '../SearchBar/SearchBar';

const Covariates = ({ selected, handleSelect }) => {
  const { source } = useSourceContext();

  const covariates = useQuery(
    ['covariates', source],
    () => fetchCovariates(source),
    queryConfig,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (inputSearchTerm) => {
    setSearchTerm(inputSearchTerm);
  };

  const fetchedCovariates = useFetch(covariates, 'concepts');
  const displayedCovariates = useFilter(
    fetchedCovariates,
    searchTerm,
    'concept_name',
  );

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
      <React.Fragment>
        <SearchBar
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          field='concept name'
        />
        <Table
          className='GWASUI-table1'
          rowKey='concept_id'
          size='middle'
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '500'],
          }}
          rowSelection={covariateSelection()}
          columns={covariateTableConfig}
          dataSource={displayedCovariates}
        />
      </React.Fragment>
    );
  }
  return <React.Fragment />;
};

Covariates.propTypes = {
  selected: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default Covariates;
