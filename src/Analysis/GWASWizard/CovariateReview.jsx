/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import {
  Space, Table, Spin,
} from 'antd';
import { fetchCovariateStats, queryConfig } from './wizardEndpoints/cohortMiddlewareApi';

export const covariateReviewTableConfig = [
  {
    title: 'Variable ID',
    dataIndex: 'concept_id',
    key: 'concept_id',
  },
  {
    title: 'Variable Name',
    dataIndex: 'concept_name',
    key: 'concept_name',
  },
  {
    title: 'Missing in Case',
    dataIndex: 'n_missing_ratio_case',
    key: 'n_missing_ratio_case',
    render: (_, record) => (
      <span>{`${(record.n_missing_ratio_case * 100).toFixed(0)}%`}</span>
    ),
  },
  {
    title: 'Missing in Control',
    dataIndex: 'n_missing_ratio_control',
    key: 'n_missing_ratio_control',
    render: (_, record) => (
      <span>{`${(record.n_missing_ratio_control * 100).toFixed(0)}%`}</span>
    ),
  },
];

const CovariateReview = ({
  caseCohortDefinitionId, controlCohortDefinitionId, selectedCovariates, sourceId,
}) => {
  const results = useQueries([
    { queryKey: ['cohortstats', selectedCovariates, caseCohortDefinitionId], queryFn: () => fetchCovariateStats(caseCohortDefinitionId, selectedCovariates.map((cov) => cov.concept_id), sourceId), ...queryConfig },
    { queryKey: ['cohortstats', selectedCovariates, controlCohortDefinitionId], queryFn: () => fetchCovariateStats(controlCohortDefinitionId, selectedCovariates.map((cov) => cov.concept_id), sourceId), ...queryConfig },
  ]);

  const getMissingRatioForControl = (concept_id, concepts) => {
    // iterate over concepts and return the n_missing_ratio for the
    // concept where concept_id matches the givent concept_id
    const controlFound = concepts.find((concept) => concept.concept_id === concept_id);
    if (controlFound) return controlFound.n_missing_ratio;

    throw new Error('Unexpected error: concept id not found on control set!');
  };
  const {
    statusCase, statusControl, dataCase, dataControl,
  } = {
    statusCase: results[0].status, statusControl: results[1].status, dataCase: results[0].data, dataControl: results[1].data,
  };

  if (statusCase === 'loading' || statusControl === 'loading') {
    return <Spin />;
  }
  if (statusCase === 'error' || statusControl === 'error') {
    return <React.Fragment>Error</React.Fragment>;
  }
  if (dataCase && dataControl) {
    // fuse both datasets by adding a new "n_missing_ratio_control" attribute to dataCase based on
    // what is found in dataControl for the same concept:
    const allConcepts = dataCase.concepts.map((concept) => ({
      ...concept,
      n_missing_ratio_case: concept.n_missing_ratio,
      n_missing_ratio_control: getMissingRatioForControl(concept.concept_id, dataControl.concepts),
    }));
    // after map above, allConcepts contains both case and control stats:
    return (
      <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
        <h4 className='GWASUI-selectInstruction' data-tour='step-4-review'>
                    In this step, you can review the covariates selection based on % missing metrics.
                    To adjust covariates please return to Step 3.
        </h4>
        <div className='GWASUI-mainTable' data-tour='covariates-table'>
          <Table
            className='GWASUI-review-table'
            rowKey='concept_id'
            pagination={{ pageSize: 10 }}
            columns={covariateReviewTableConfig}
            dataSource={allConcepts}
          />
        </div>
      </Space>
    );
  }
  return false;
};
CovariateReview.propTypes = {
  caseCohortDefinitionId: PropTypes.number.isRequired,
  controlCohortDefinitionId: PropTypes.number.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

export default CovariateReview;
