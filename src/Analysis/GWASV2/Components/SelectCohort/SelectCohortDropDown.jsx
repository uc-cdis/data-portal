import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, queryConfig } from 'react-query';
import { Select, Spin } from 'antd';
import { fetchCohortDefinitions } from '../../Utils/cohortMiddlewareApi';
import { useFetch } from '../../Utils/formHooks';
import { useSourceContext } from '../../Utils/Source';

const SelectCohortDropDown = ({ handleCohortSelect }) => {
  const { source } = useSourceContext();
  const cohorts = useQuery(
    ['cohortdefinitions', source],
    () => fetchCohortDefinitions(source),
    queryConfig,
  );
  const fetchedCohorts = useFetch(cohorts, 'cohort_definitions_and_stats');

  const onChange = (selectedCohortDefinitionId) => {
    // find cohort object based on id:
    const selectedCohort = fetchedCohorts.find(
      (item) => item.cohort_definition_id === selectedCohortDefinitionId,
    );
    handleCohortSelect(selectedCohort);
  };

  return cohorts?.status === 'success' ? (
    <Select
      showSearch
      placeholder='Select a cohort'
      optionFilterProp='children'
      onChange={onChange}
      filterOption={(input, option) => (option?.cohort_name ?? '').toLowerCase().includes(input.toLowerCase())}
      options={fetchedCohorts}
      fieldNames={{ label: 'cohort_name', value: 'cohort_definition_id' }}
    />
  ) : (
    <React.Fragment>
      <div
        className='GWASUI-spinnerContainer GWASUI-emptyTable'
      >
        <Spin />
      </div>
    </React.Fragment>
  );
};

SelectCohortDropDown.propTypes = {
  handleCohortSelect: PropTypes.any.isRequired,
};

export default SelectCohortDropDown;
