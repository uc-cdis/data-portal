import React, { useState } from "react";
import { PropTypes } from "prop-types";
import ContinuousCovariates from "../Shared/SelectCovariates/ContinuousCovariates";
import CustomDichotomousCovariates from "../Shared/SelectCovariates/CustomDichotomousCovariates";

const AllCovariates = ({
    allCovariates,
    handleCovariates,
    currentCovariate,
}) => {
    const [mode, setMode] = useState("");
    return <>
        {mode === "continuous" ?
            // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
            (<ContinuousCovariates
                covariates={allCovariates}
                handleOutcome={handleOutcome}
            />) :
            mode === "dichotomous" ?
                // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
                <CustomDichotomousCovariates
                    dichotomous={allCovariates}
                    handleOutcome={handleOutcome}
                    sourceId={sourceId}
                /> :
                <div>
                    <button onClick={() => setMode("continuous")}>Add Continuous Outcome Phenotype</button>
                    <button onClick={() => setMode("dichotomous")}>Add Dichotomous Outcome Phenotype</button>
                </div>
        }
    </>
}

AllCovariates.propTypes = {
    allCovariates: PropTypes.array.isRequired,
    handleCovariates: PropTypes.func.isRequired,
    currentCovariate: PropTypes.object.isRequired
};

export default AllCovariates;
