import React, { useState } from "react";
import { PropTypes } from "prop-types";
import ContinuousCovariates from "../Shared/GWASCovariates/ContinuousCovariates";
import CustomDichotomousCovariates from "../Shared/GWASCovariates/CustomDichotomousCovariates";

const SelectCovariates = ({
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
                handleCovariateSubmit={handleCovariates}
            />) :
            mode === "dichotomous" ?
                // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
                <CustomDichotomousCovariates
                    dichotomous={allCovariates}
                    handleCovariateSubmit={handleCovariates}
                    sourceId={sourceId}
                /> :
                <div>
                    <button style={{ height: 60, marginRight: 5}} onClick={() => setMode("continuous")}>Add Continuous Outcome Phenotype</button>
                    <button style={{ height: 60, marginLeft: 5}}  onClick={() => setMode("dichotomous")}>Add Dichotomous Outcome Phenotype</button>
                </div>}
    </>
}

SelectCovariates.propTypes = {
    allCovariates: PropTypes.array.isRequired,
    handleCovariates: PropTypes.func.isRequired,
    currentCovariate: PropTypes.object.isRequired
};

export default SelectCovariates;
