import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, queryConfig } from 'react-query';
import { Select, Spin } from 'antd';
import { fetchCohortDefinitions } from '../wizardEndpoints/cohortMiddlewareApi';
import { useFetch } from '../formHooks';
import { useSourceContext } from '../Source';

// Pieter Lukasse authored this component in https://github.com/uc-cdis/data-portal/pull/1154/files

const SelectCohortDropDown = ({
  handleCohortSelect,
}) => {
  const { source } = useSourceContext();
  const cohorts = useQuery(
    ['cohortdefinitions', source],
    () => fetchCohortDefinitions(source),
    queryConfig,
  );
  const fetchedCohorts = useFetch(cohorts, 'cohort_definitions_and_stats');

  const onChange = (selectedCohortDefinitionId) => {
    // find cohort object based on id:
    const selectedCohort = fetchedCohorts.find((item) => item.cohort_definition_id === selectedCohortDefinitionId);
    handleCohortSelect(selectedCohort);
  };

  return cohorts?.status === 'success' ? (
    <Select
      style={{ width: '300px' }}
      showSearch={true}
      placeholder='Select a cohort'
      optionFilterProp='children'
      onChange={onChange}
      dropdownStyle={{ minWidth: '800px' }}
      filterOption={(input, option) => (option?.cohort_name ?? '').toLowerCase().includes(input.toLowerCase())}
      options={fetchedCohorts}
      fieldNames={{ label: 'cohort_name', value: 'cohort_definition_id' }}
    />
  ) : (
    <React.Fragment>
      <div style={{ width: '300px' }} className='GWASUI-spinnerContainer GWASUI-emptyTable'>
        <Spin />
      </div>
    </React.Fragment>
  );
};

SelectCohortDropDown.propTypes = {
  handleCohortSelect: PropTypes.any.isRequired,
};

export default SelectCohortDropDown;
