import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import {
  fetchCovariates,
  queryConfig,
} from '../wizardEndpoints/cohortMiddlewareApi';
import { useFetch, useFilter } from '../formHooks';
import { useSourceContext } from '../Source';
import SearchBar from '../SearchBar';

const Covariates = ({ selected, handleSelect, setBuffering }) => {
  const { source } = useSourceContext();

  const covariates = useQuery(
    ['covariates', source],
    () => fetchCovariates(source),
    queryConfig,
  );

  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    const { status } = covariates;
    setBuffering(status !== "success" ? true : false)
  }, [covariates.status]);

  if (covariates?.status === 'loading') {
    return (
      <div
        style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (covariates?.status === 'error') {
    return (
      <React.Fragment>
        <span>Error!</span>
      </React.Fragment>
    );
  }

  if (covariates?.status === 'success') {
    return (
      <div
        style={{
          width: "50%",
          margin: "0 auto"
        }}
      >
        <div>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={setSearchTerm}
            field='concept name'
          />
        </div>
        <Table
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
      </div>
    );
  }
  return <React.Fragment />;
};

Covariates.propTypes = {
  selected: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
  setBuffering: PropTypes.func.isRequired
};

export default Covariates;
