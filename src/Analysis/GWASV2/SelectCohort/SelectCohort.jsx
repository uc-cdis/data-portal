import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddCohortButton from './Utils/AddCohortButton';
import CohortDefinitions from './Utils/CohortDefinitions';
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from '../Shared/SearchBar';
import './SelectCohort.css';

const SelectCohort = ({ selectedCohort, handleCohortSelect }) => {
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
              selectedCohort={selectedCohort}
              handleCohortSelect={handleCohortSelect}
              searchTerm={cohortSearchTerm}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SelectCohort.propTypes = {
  selectedCohort: PropTypes.any,
  handleCohortSelect: PropTypes.func.isRequired,
};
SelectCohort.defaultProps = {
  selectedCohort: null,
};
export default SelectCohort;
