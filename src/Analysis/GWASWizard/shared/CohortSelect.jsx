import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CohortDefinitions from './CohortDefinitions';
import '../../GWASUIApp/GWASUIApp.css';
import SearchBar from './SearchBar';

const CohortSelect = ({
  selectedCohort, handleCohortSelect, sourceId, otherCohortSelected = '', current,
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  useEffect(() => {
    setCohortSearchTerm('');
  }, [current]);

  const handleCohortSearch = (searchTerm) => {
    setCohortSearchTerm(searchTerm);
  };
  return (
    <div>
      <SearchBar
        searchTerm={cohortSearchTerm}
        handleSearch={handleCohortSearch}
        fields={'cohort name...'}
      />
      <CohortDefinitions
        selectedCohort={selectedCohort}
        handleCohortSelect={handleCohortSelect}
        sourceId={sourceId}
        searchTerm={cohortSearchTerm}
        otherCohortSelected={otherCohortSelected}
      />
    </div>
  );
};

CohortSelect.propTypes = {
  selectedCohort: PropTypes.object,
  handleCohortSelect: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  otherCohortSelected: PropTypes.string,
  current: PropTypes.number.isRequired,
};

CohortSelect.defaultProps = {
  selectedCohort: undefined,
  otherCohortSelected: '',
};

export default CohortSelect;
