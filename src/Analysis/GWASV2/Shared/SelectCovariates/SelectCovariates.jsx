import React from "react";
import PropTypes from "prop-types";
// import { Spin } from "antd";

import "./SelectCovariates.css";

const SelectCovariates = ({
    covariates,
    handleCovariateChange
}) => {
    return <><button onClick={() => console.log('covs', covariates)}>covs</button></>
}

SelectCovariates.propTypes = {
    selectedCovariates: PropTypes.array.isRequired,
    handleCovariateChange: PropTypes.func.isRequired
};


export default SelectCovariates;
