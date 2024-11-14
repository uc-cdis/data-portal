import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Select, Spin } from 'antd';
import { fetchCohortDefinitions } from '../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../SharedUtils/QueryConfig';
import { useFetch } from '../../Utils/formHooks';
import { useSourceContext } from '../../Utils/Source';

const SelectCohortDropDown = ({ handleCohortSelect, selectedTeamProject }) => {
  const { source } = useSourceContext();
  const cohorts = useQuery(
    ['cohortdefinitions', source, selectedTeamProject],
    () => fetchCohortDefinitions(source, selectedTeamProject),
    queryConfig
  );
  const fetchedCohorts = useFetch(cohorts, 'cohort_definitions_and_stats');

  const onChange = (selectedCohortDefinitionId) => {
    // find cohort object based on id:
    const selectedCohort = fetchedCohorts.find(
      (item) => item.cohort_definition_id === selectedCohortDefinitionId
    );
    handleCohortSelect(selectedCohort);
  };
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleDropdownVisibleChange = (open) => {
    setIsDropdownVisible(open);
    if (open) {
      alert('open');
    } else {
      alert('closed');
    }
  };

  if (cohorts?.status === 'loading') {
    return (
      <React.Fragment>
        <div className='GWASUI-spinnerContainer GWASUI-emptyTable'>
          <Spin />
        </div>
      </React.Fragment>
    );
  }
  if (cohorts?.status === 'error') {
    return <React.Fragment>Error getting data for dropdown</React.Fragment>;
  }

  return (
    <Select
      showSearch
      onDropdownVisibleChange={handleDropdownVisibleChange}
      className='select-cohort'
      placeholder='Select a cohort'
      optionFilterProp='children'
      onChange={onChange}
      filterOption={(input, option) =>
        (option?.cohort_name ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={fetchedCohorts}
      fieldNames={{ label: 'cohort_name', value: 'cohort_definition_id' }}
    />
  );
};

SelectCohortDropDown.propTypes = {
  handleCohortSelect: PropTypes.any.isRequired,
  selectedTeamProject: PropTypes.string.isRequired,
};

export default SelectCohortDropDown;
