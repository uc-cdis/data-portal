import React from "react";
import PropTypes from "prop-types";
// import { Spin } from "antd";
import "./GWASCovariates.css";
import Covariates from "./Utils/Covariates";

const ContinuousCovariates = ({
    // covariates,
    setMode,
    sourceId,
    // searchTerm,
    selectedCovariate = undefined,
    handleCovariateSubmit
}) => {

    return (<>
        <Covariates
            selectedCovariate={selectedCovariate}
            handleCovariateSelect={handleCovariateSubmit}
            sourceId={sourceId}
        // searchTerm={searchTerm}
        />
        <button style={{marginLeft: 5}} onClick={() => setMode("")}>Submit</button>
        <button onClick={() => {
            handleCovariateSubmit(undefined)
            setMode("")
        }
        }>cancel</button></>)
}

ContinuousCovariates.propTypes = {
    handleCovariateSubmit: PropTypes.func.isRequired,
    setMode: PropTypes.func.isRequired,
    sourceId: PropTypes.number.isRequired,
    // searchTerm: PropTypes.string.isRequired
};


export default ContinuousCovariates;
