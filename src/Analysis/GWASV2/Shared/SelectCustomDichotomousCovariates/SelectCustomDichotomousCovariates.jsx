import React from "react";
import PropTypes from "prop-types";
// import { Spin } from "antd";
import "./SelectCustomDichotomousCovariates.css";

const SelectCustomDichotomousCovariates = ({
    customDichotomousCovariates,
    handleCovariateChange
}) => {
    return <><button onClick={() => console.log('cd', customDichotomousCovariates)}>cd list</button></>
}

SelectCustomDichotomousCovariates.propTypes = {
    customDichotomousCovariates: PropTypes.array.isRequired,
    handleCovariateChange: PropTypes.func.isRequired
};


export default SelectCustomDichotomousCovariates;
