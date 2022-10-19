import React from "react";
import PropTypes from "prop-types";
// import { Spin } from "antd";
import "./GWASCovariates.css";
import Covariates from "./Utils/Covariates";

const ContinuousCovariates = ({
    covariates,
    setMode,
    sourceId,
    // searchTerm,
    handleCovariateSubmit
}) => {

    return (<><Covariates
        selectedCovariates={covariates}
        handleCovariateSelect={handleCovariateSubmit}
        sourceId={sourceId}
        // searchTerm={searchTerm}
    />
    <button onClick={() => console.log('props', props)}>props</button>
        <button onClick={() => setMode("")}>cancel</button></>)
}

ContinuousCovariates.propTypes = {
    covariates: PropTypes.array.isRequired,
    handleCovariateSubmit: PropTypes.func.isRequired,
    setMode: PropTypes.func.isRequired,
    sourceId: PropTypes.number.isRequired,
    // searchTerm: PropTypes.string.isRequired
};


export default ContinuousCovariates;
