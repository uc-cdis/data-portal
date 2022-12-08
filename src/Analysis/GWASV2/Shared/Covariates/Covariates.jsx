import React, { useState } from 'react';
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

const Covariates = ({ selected, handleSelect }) => {
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

  if (covariates?.status === 'loading') {
    return (
      <div
      style={{ textAlign: "center", marginTop: 50 }}>
          <Spin />
      </div>
    );
  }

  if (covariates?.status === 'error') {
    return (
      <React.Fragment>
        {/* <div className='GWASUI-spinnerContainer GWASUI-emptyTable'> */}
          <span>Error!</span>
        {/* </div> */}
      </React.Fragment>
    );
  }

  if (covariates?.status === 'success') {
    return (
      <div
      style={{
        width: "35%",
        margin: "0 auto"
      }}
      // style={{
      //   display: "flex",
      //   flexDirection: "column",
      //   margin: "auto"
      // }}
      >
        <div>
        <SearchBar
          searchTerm={searchTerm}
          handleSearch={setSearchTerm}
          field='concept name'
        />
        </div>
        <Table
          // className='GWASUI-table2'
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
};

export default Covariates;
