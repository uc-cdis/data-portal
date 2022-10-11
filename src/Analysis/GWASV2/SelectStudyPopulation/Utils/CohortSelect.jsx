import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../Shared/SearchBar';
import AddCohortButton from './AddCohortButton';
import CohortDefinitions from './CohortDefinitions';

const CohortSelect = ({
  selectedCohort,
  handleCohortSelect,
  sourceId,
  otherCohortSelected = '',
  current,
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  useEffect(() => {
    setCohortSearchTerm('');
  }, [current]);

  const handleCohortSearch = (searchTerm) => {
    setCohortSearchTerm(searchTerm);
  };
  return (
  <>
    <div className='GWASUI-row cohort-table-search' >
      <div className='GWASUI-column'>
        <SearchBar
          searchTerm={cohortSearchTerm}
          handleSearch={handleCohortSearch}
          fields={'cohort name'}
        />
      </div>
      <div data-tour='step-1-new-cohort' className='GWASUI-column GWASUI-newCohort'>
        <AddCohortButton />
      </div>
    </div>
    <div className='GWASUI-mainTable'>
      <div data-tour='cohort-table'>
        <div data-tour='cohort-table-body'>
          <CohortDefinitions
            selectedCohort={selectedCohort}
            handleCohortSelect={handleCohortSelect}
            sourceId={sourceId}
            searchTerm={cohortSearchTerm}
            otherCohortSelected={otherCohortSelected}
          />
        </div>
      </div>
    </div>
  </>
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
