import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import {
  Table, Spin,
} from 'antd';
import { fetchCohortDefinitions, queryConfig } from '../wizardEndpoints/cohortMiddlewareApi';
import { cohortTableConfig, cohortSelection } from './constants';
import '../../GWASUIApp/GWASUIApp.css';
import { useFetch, useFilter } from './formHooks';

const CohortDefinitions = ({
  sourceId, selectedCohort = undefined, handleCohortSelect, otherCohortSelected, searchTerm,
}) => {
  const cohorts = useQuery(['cohortdefinitions', sourceId], () => fetchCohortDefinitions(sourceId), queryConfig);
  const fetchedCohorts = useFetch(cohorts, 'cohort_definitions_and_stats');
  const displayedCohorts = useFilter(fetchedCohorts, searchTerm, 'cohort_name');

  return (
    (cohorts?.status === 'success') ? (
      <Table
        className='GWASUI-table1'
        rowKey='cohort_definition_id'
        size='middle'
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '500'] }}
        rowSelection={cohortSelection(handleCohortSelect, selectedCohort, otherCohortSelected)}
        columns={cohortTableConfig}
        dataSource={displayedCohorts}
      />
    ) : (
      <React.Fragment>
        <div className='GWASUI-spinnerContainer GWASUI-emptyTable'><Spin /></div>
      </React.Fragment>
    )
  );
};

CohortDefinitions.propTypes = {
  sourceId: PropTypes.number.isRequired,
  selectedCohort: PropTypes.object,
  handleCohortSelect: PropTypes.func.isRequired,
  otherCohortSelected: PropTypes.string,
  searchTerm: PropTypes.string.isRequired,
};

CohortDefinitions.defaultProps = {
  selectedCohort: undefined,
  otherCohortSelected: '',
};

export default CohortDefinitions;
