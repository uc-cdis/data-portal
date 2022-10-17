import React from "react";
import { PropTypes } from "prop-types";
import SelectCovariates from "../Shared/SelectCovariates/SelectCovariates";
import SelectCustomDichotomousCovariates from "../Shared/SelectCustomDichotomousCovariates/SelectCustomDichotomousCovariates";

const Outcome = ({
    allCovariates,
    handleCovariateChange,
    outcome
}) => {
    return <>
        <button onClick={() => console.log('outcome', outcome)}>outcome</ button>
        <SelectCovariates covariates={allCovariates} handleCovariateChange={handleCovariateChange} />
        <SelectCustomDichotomousCovariates customDichotomousCovariates={allCovariates} handleCovariateChange={handleCovariateChange} />
    </>
}

Outcome.propTypes = {
    handleCovariateChange: PropTypes.func.isRequired,
    allCovariates: PropTypes.array.isRequired,
    outcome: PropTypes.object.isRequired
};


export default Outcome;
