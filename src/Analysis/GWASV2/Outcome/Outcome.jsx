import React, { useState } from "react";
import { PropTypes } from "prop-types";
import SelectCovariates from "../Shared/SelectCovariates/SelectCovariates";
import SelectCustomDichotomousCovariates from "../Shared/SelectCustomDichotomousCovariates/SelectCustomDichotomousCovariates";

const Outcome = ({
    allCovariates,
    handleCovariateChange,
    outcome
}) => {
    const [mode, setMode] = useState("");
    return <>
        {mode === "continuous" ?
            (<SelectCovariates covariates={allCovariates} handleCovariateChange={handleCovariateChange} />) :
            mode === "dichotomous" ?
                <SelectCustomDichotomousCovariates customDichotomousCovariates={allCovariates} handleCovariateChange={handleCovariateChange} /> :
                <div>
                    <button onClick={() => setMode("continuous")}>Add Continuous Outcome Phenotype</button>
                    <button onClick={() => setMode("dichotomous")}>Add Dichotomous Outcome Phenotype</button>
                </div>
        }
    </>
}

Outcome.propTypes = {
    handleCovariateChange: PropTypes.func.isRequired,
    allCovariates: PropTypes.array.isRequired,
    outcome: PropTypes.object.isRequired
};


export default Outcome;
