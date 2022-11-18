import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AddCohortButton from './AddCohortButton';
import CohortDefinitions from './CohortDefinitions';
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from '../../Shared/SearchBar';
import '../StudyPopulationCohortSelect.css';

const StudyPopulationCohortSelect = ({
  selectedStudyPopulationCohort,
  handleStudyPopulationCohortSelect,
  dispatch,
  cd,
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  // useEffect(() => {
  //   setCohortSearchTerm("");
  // }, [current]);

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
              handleCohortSelect={handleStudyPopulationCohortSelect}
              searchTerm={cohortSearchTerm}
              cd={cd}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

StudyPopulationCohortSelect.propTypes = {
  selectedStudyPopulationCohort: PropTypes.any,
  handleStudyPopulationCohortSelect: PropTypes.any.isRequired,
  // sourceId: PropTypes.number.isRequired,
  // current: PropTypes.number.isRequired,
  cd: PropTypes.bool.isRequired,
};

StudyPopulationCohortSelect.defaultProps = {
  selectedStudyPopulationCohort: undefined,
};

export default StudyPopulationCohortSelect;
