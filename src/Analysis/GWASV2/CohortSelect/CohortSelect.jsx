import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddCohortButton from './Utils/AddCohortButton';
import CohortDefinitions from './Utils/CohortDefinitions';
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from '../Shared/SearchBar';
import { pseudoTw } from "../Shared/constants";

const CohortSelect = ({
  selectedCohort,
  handleCohortSelect,
  namespace
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState('');

  const {
    flexRow,
    justifyBetween,
    "mx-auto": mxAuto,
    oneThirdWidth } = pseudoTw;

  return (
    <React.Fragment>
      <div
        style={{
          ...oneThirdWidth,
          ...mxAuto,
          ...flexRow,
          ...justifyBetween
        }}
      >
        <SearchBar
          searchTerm={cohortSearchTerm}
          handleSearch={setCohortSearchTerm}
          field={'Cohort Name'}
        />
        <div
          data-tour='step-1-new-cohort'
        >
          <AddCohortButton />
        </div>
      </div>
      <div
      >
        <div data-tour='cohort-table'>
          <div data-tour='cohort-table-body'
          >
            <div
              style={{
                ...oneThirdWidth,
                ...mxAuto
              }}
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
