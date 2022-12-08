import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddCohortButton from './Utils/AddCohortButton';
import CohortDefinitions from './Utils/CohortDefinitions';
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from '../Shared/SearchBar';
// import './CohortSelect.css';

const CohortSelect = ({
  selectedCohort,
  handleCohortSelect,
  namespace
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  return (
    <React.Fragment>
      <div
        style={{
          width: "35%",
          margin: '0 auto',
          display: "flex",
          direction: "row",
          justifyContent: "space-between"
        }}
      >
        <SearchBar
          searchTerm={cohortSearchTerm}
          handleSearch={setCohortSearchTerm}
          field={'Cohort Name'}
        />
        <div
          data-tour='step-1-new-cohort'
        // className='GWASUI-column GWASUI-newCohort'
        >
          <AddCohortButton />
        </div>
      </div>
      <div
      // className='GWASUI-mainTable'
      >
        <div data-tour='cohort-table'>
          <div data-tour='cohort-table-body'
          >
            <div
              style={{ width: "35%", margin: '0 auto', marginTop: 10 }}
            >
            <CohortDefinitions
              selectedCohort={selectedCohort}
              handleCohortSelect={handleCohortSelect}
              searchTerm={cohortSearchTerm}
              namespace={namespace}
            />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CohortSelect.propTypes = {
  selectedCohort: PropTypes.any,
  handleCohortSelect: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired
};
CohortSelect.defaultProps = {
  selectedCohort: null,
};
export default CohortSelect;
