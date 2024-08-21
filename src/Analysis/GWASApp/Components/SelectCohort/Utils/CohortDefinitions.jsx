import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Table, Spin } from 'antd';
import { fetchCohortDefinitions } from '../../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../../SharedUtils/QueryConfig';
import { useFetch, useFilter } from '../../../Utils/formHooks';
import { useSourceContext } from '../../../Utils/Source';

const CohortDefinitions = ({
  selectedCohort = undefined,
  handleCohortSelect,
  searchTerm,
  selectedTeamProject,
}) => {
  const { source } = useSourceContext();

  const cohorts = useQuery(
    ['cohortdefinitions', source, selectedTeamProject],
    () => fetchCohortDefinitions(source, selectedTeamProject),
    // only call this once the source is not undefined
    { enabled: source !== undefined, ...queryConfig },
  );
  const fetchedCohorts = useFetch(cohorts, 'cohort_definitions_and_stats');
  const displayedCohorts = useFilter(fetchedCohorts, searchTerm, 'cohort_name');

  const cohortSelection = (inputSelectedCohort) => ({
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: inputSelectedCohort
      ? [inputSelectedCohort.cohort_definition_id]
      : [],
    onChange: (_, selectedRows) => {
      handleCohortSelect(selectedRows[0]);
    },
  });
  const cohortTableConfig = [
    {
      title: 'Cohort Name',
      dataIndex: 'cohort_name',
      key: 'cohort_name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
  ];
  if (cohorts?.status === 'error') return <React.Fragment>Error getting data for table</React.Fragment>;

  return cohorts?.status === 'success' ? (
    <Table
      className='GWASUI-table1'
      rowKey='cohort_definition_id'
      size='middle'
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100', '500'],
      }}
      onRow={(selectedRow) => ({
        onClick: () => {
          handleCohortSelect(selectedRow);
        },
      })}
      rowSelection={cohortSelection(selectedCohort)}
      columns={cohortTableConfig}
      dataSource={displayedCohorts}
    />
  ) : (
    <React.Fragment>
      <div className='GWASUI-spinnerContainer GWASUI-emptyTable'>
        <Spin />
      </div>
    </React.Fragment>
  );
};

CohortDefinitions.propTypes = {
  selectedCohort: PropTypes.any,
  handleCohortSelect: PropTypes.any.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedTeamProject: PropTypes.string.isRequired,
};

CohortDefinitions.defaultProps = {
  selectedCohort: undefined,
};

export default CohortDefinitions;
