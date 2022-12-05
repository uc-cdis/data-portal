import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, queryConfig } from 'react-query';
import { Select, Spin } from 'antd';
import { fetchCohortDefinitions } from '../../Shared/cohortMiddlewareApi';
import { useFetch } from '../../Shared/formHooks';
import { useSourceContext } from '../../Shared/Source';

const SelectCohortDropDown = ({
  selectedCohort = undefined,
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
    console.log(`selected ${selectedCohortDefinitionId}`);
    // find cohort object based on id:
    const selectedCohort = fetchedCohorts.find(item => item.cohort_definition_id === selectedCohortDefinitionId);
    handleCohortSelect(selectedCohort);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  return cohorts?.status === 'success' ? (
  <Select
    style={{width: '300px'}}
    showSearch
    placeholder="Select a cohort"
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    dropdownStyle={{minWidth: '800px'}}
    filterOption={(input, option) =>
      (option?.cohort_name ?? '').toLowerCase().includes(input.toLowerCase())
    }
    options={fetchedCohorts}
    fieldNames={{label: 'cohort_name', value: 'cohort_definition_id'}}
  />
  ) : (
    <React.Fragment>
      <div style={{width: '300px'}} className='GWASUI-spinnerContainer GWASUI-emptyTable'>
        <Spin />
      </div>
    </React.Fragment>
  );
};

SelectCohortDropDown.propTypes = {
  selectedCohort: PropTypes.any,
  handleCohortSelect: PropTypes.any.isRequired,
};

SelectCohortDropDown.defaultProps = {
  selectedCohort: undefined,
};

export default SelectCohortDropDown;
