import React from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';

const ContinuousCovariates = ({
  setVariableType,
  selected,
  dispatch,
  handleSelect,
  type,
  covariates
}) => {
  const formatSelected = (covariate) => {
    let { concept_code, prefixed_concept_id, ...cov } = covariate;
    return cov;
  }
  return (
    <React.Fragment>
      <Covariates selected={selected} handleSelect={handleSelect} />
      <button
        type='button'
        style={{ marginLeft: 5 }}
        onClick={() => {
          dispatch(
            { accessor: type, payload: type === "outcome" ? formatSelected(selected) : [...covariates, formatSelected(selected)] }
          );
          if (type === "outcome") {
            dispatch({
              accessor: "currentStep", payload: 2
            })
          }
          setVariableType(undefined);
        }}
      >
        Submit
      </button>
      <button
        type='button'
        onClick={() => {
          setVariableType(undefined);
        }}
      >
        cancel
      </button>
    </React.Fragment>
  );
};

ContinuousCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
  setVariableType: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  covariates: PropTypes.array.isRequired
};

export default ContinuousCovariates;
