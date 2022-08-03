import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Space, Table, Spin,
} from 'antd';
import { useQuery } from 'react-query';
import { fetchCovariateStats, queryConfig } from './wizard-endpoints/cohort-middleware-api';
import { outcomeSelection } from './shared/constants';
import SearchBar from './shared/SearchBar';
import { useFetch, useFilter } from './shared/form-hooks';

export const outcomeReviewTableConfig = [
  {
    title: 'Concept ID',
    dataIndex: 'concept_id',
    key: 'concept_id',
  },
  {
    title: 'Concept Name',
    dataIndex: 'concept_name',
    key: 'concept_name',
  },
  {
    title: '% Missing',
    dataIndex: 'n_missing_ratio',
    key: 'n_missing_ratio',
    render: (_, record) => (
      <span>{`${(record.n_missing_ratio * 100).toFixed(0)}%`}</span>
    ),
  },
];

const OutcomeSelectReview = ({
  cohortDefinitionId,
  outcome,
  handleOutcomeSelect,
  selectedCovariates,
  sourceId,
  current,
}) => {
  const [outcomeSearchTerm, setOutcomeSearchTerm] = useState('');
  const outcomeOptions = useQuery(
    ['cohortstats', cohortDefinitionId, selectedCovariates],
    () => fetchCovariateStats(
      cohortDefinitionId,
      selectedCovariates.map((cov) => cov.concept_id),
      sourceId),
    queryConfig,
  );
  const fetchedOutcomes = useFetch(outcomeOptions, 'concepts');
  const displayedOutcomes = useFilter(fetchedOutcomes, outcomeSearchTerm, 'concept_name');

  const handleOutcomeSearch = (searchTerm) => {
    setOutcomeSearchTerm(searchTerm);
  };

  useEffect(() => {
    setOutcomeSearchTerm('');
  }, [current]);

  if (outcomeOptions.status === 'loading') {
    return <Spin />;
  }

  if (outcomeOptions.status === 'error') {
    return <span>Something went wrong</span>;
  }

  return (
    <div>
      <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
        <hr />
        <h4 className='GWASUI-selectInstruction'>
                    In this step, you can review the covariates selection based on % missing metrics
                    and select an outcome variable.
        </h4>
        <div className='GWASUI-mainTable'>
          <SearchBar
            searchTerm={outcomeSearchTerm}
            handleSearch={handleOutcomeSearch}
            fields={'outcome name...'}
          />
          <Table
            className='GWASUI-review-table'
            rowKey='concept_id'
            rowSelection={outcomeSelection(handleOutcomeSelect, outcome)}
            pagination={{ pageSize: 10 }}
            columns={outcomeReviewTableConfig}
            dataSource={displayedOutcomes}
          />
        </div>
      </Space>
    </div>
  );
};

OutcomeSelectReview.propTypes = {
  cohortDefinitionId: PropTypes.number.isRequired,
  outcome: PropTypes.object || undefined,
  selectedCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  handleOutcomeSelect: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
};

OutcomeSelectReview.defaultProps = {
  outcome: undefined,
};

export default OutcomeSelectReview;
