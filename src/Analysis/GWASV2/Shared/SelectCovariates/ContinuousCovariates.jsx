import React from "react";
import PropTypes from "prop-types";
// import { Spin } from "antd";
import "./SelectCovariates.css";

const ContinuousCovariates = ({
    covariates,
    handleCovariateSubmit,
    setMode
}) => {
    return (<><span onClick={() => console.log('cont covariates')}>hi</span>
    <button onClick={() => setMode("")}>cancel</button></>)
}

ContinuousCovariates.propTypes = {
    covariates: PropTypes.array.isRequired,
    handleCovariateSubmit: PropTypes.func.isRequired
};


export default ContinuousCovariates;
