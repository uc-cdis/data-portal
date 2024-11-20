import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin, Radio } from 'antd';
import { fetchCovariates } from '../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../SharedUtils/QueryConfig';
import { useFetch, useFilter } from '../../Utils/formHooks';
import { useSourceContext } from '../../Utils/Source';
import SearchBar from '../SearchBar/SearchBar';

const Covariates = ({ selected, handleSelect, submittedCovariateIds }) => {
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
  const filteredCovariates = useFilter(
    fetchedCovariates,
    searchTerm,
    'concept_name',
  );

  // remove already selected Covariates from list
  const displayedCovariates = filteredCovariates.filter((x) => !submittedCovariateIds.includes(x.concept_id));

  const covariateSelection = () => ({
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: selected ? [selected.concept_id] : [],
    onChange: (_, selectedRows) => {
      handleSelect(selectedRows[0]);
    },
    renderCell: (checked, record) => (
      <Radio
        checked={checked}
        value={record.concept_id}
        aria-label={'Select row for concept'}
      />
    ),
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
      <div data-tour='select-concept'>
        <SearchBar
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          field='concept name'
        />
        <Table
          className='GWASUI-table1'
          data-tour='concept-table'
          rowKey='concept_id'
          size='middle'
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '500'],
          }}
          onRow={(selectedRow) => ({
            onClick: () => {
              handleSelect(selectedRow);
            },
          })}
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
  selected: PropTypes.object,
  handleSelect: PropTypes.func.isRequired,
  submittedCovariateIds: PropTypes.array,
};

Covariates.defaultProps = {
  selected: null,
  submittedCovariateIds: null,
};

export default Covariates;
