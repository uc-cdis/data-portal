import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AddCohortButton from './Utils/AddCohortButton';
import CohortDefinitions from './Utils/CohortDefinitions';
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from '../Shared/SearchBar';
import './CohortSelect.css';

const CohortSelect = ({
  selectedStudyPopulationCohort,
  handleSelectStudyPopulation,
  cd,
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  const handleCohortSearch = (searchTerm) => {
    setCohortSearchTerm(searchTerm);
  };
  return (
    <React.Fragment>
      <div className='GWASUI-row cohort-table-search'>
        <div className='GWASUI-column'>
          <SearchBar
            searchTerm={cohortSearchTerm}
            handleSearch={handleCohortSearch}
            field={'cohort name'}
          />
        </div>
        <div
          data-tour='step-1-new-cohort'
          className='GWASUI-column GWASUI-newCohort'
        >
          <AddCohortButton />
        </div>
      </div>
      <div className='GWASUI-mainTable'>
        <div data-tour='cohort-table'>
          <div data-tour='cohort-table-body'>
            <CohortDefinitions
              selectedCohort={selectedStudyPopulationCohort}
              handleCohortSelect={handleSelectStudyPopulation}
              searchTerm={cohortSearchTerm}
              cd={cd}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CohortSelect.propTypes = {
  selectedStudyPopulationCohort: PropTypes.any,
  handleSelectStudyPopulation: PropTypes.any.isRequired,
  cd: PropTypes.bool.isRequired,
};

CohortSelect.defaultProps = {
  selectedStudyPopulationCohort: null,
};
export default CohortSelect;
