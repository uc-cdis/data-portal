import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddCohortButton from "./AddCohortButton";
import CohortDefinitions from "./CohortDefinitions";
/* Eslint is giving error: import/no-named-as-default-member: needs a parser plugin */
/* eslint-disable-next-line */
import SearchBar from "../../Shared/SearchBar";

const CohortSelect = ({
  selectedCohort,
  handleCohortSelect,
  sourceId,
  current,
}) => {
  const [cohortSearchTerm, setCohortSearchTerm] = useState("");

  useEffect(() => {
    setCohortSearchTerm("");
  }, [current]);

  const handleCohortSearch = (searchTerm) => {
    setCohortSearchTerm(searchTerm);
  };
  return (
    <React.Fragment>
      <div className="GWASUI-row cohort-table-search">
        <div className="GWASUI-column">
          <SearchBar
            searchTerm={cohortSearchTerm}
            handleSearch={handleCohortSearch}
            field={"cohort name"}
          />
        </div>
        <div
          data-tour="step-1-new-cohort"
          className="GWASUI-column GWASUI-newCohort"
        >
          <AddCohortButton />
        </div>
      </div>
      <div className="GWASUI-mainTable">
        <div data-tour="cohort-table">
          <div data-tour="cohort-table-body">
            <CohortDefinitions
              selectedCohort={selectedCohort}
              handleCohortSelect={handleCohortSelect}
              sourceId={sourceId}
              searchTerm={cohortSearchTerm}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CohortSelect.propTypes = {
  selectedCohort: PropTypes.object,
  handleCohortSelect: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

CohortSelect.defaultProps = {
  selectedCohort: undefined,
};

export default CohortSelect;
