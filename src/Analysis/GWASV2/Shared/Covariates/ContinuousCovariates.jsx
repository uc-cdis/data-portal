import React, { useState } from 'react';
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
  const [buffering, setBuffering] = useState(true);
  const formatSelected = (covariate) => {
    let { concept_code, prefixed_concept_id, ...cov } = covariate;
    return cov;
  }
  return (
    <div
    >
      {!buffering && <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <button
          type='button'
          style={{ margin: "0 auto" }}
          onClick={() => {
            dispatch(
              {
                accessor: type,
                payload: type === "outcome" ?
                  formatSelected(selected) : [...covariates, formatSelected(selected)]
              }
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
          style={{ margin: "0 auto" }}
          type='button'
          onClick={() => {
            setVariableType(undefined);
          }}
        >
          cancel
        </button>
      </div>}
      <Covariates selected={selected} handleSelect={handleSelect} setBuffering={setBuffering} />
    </div>
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
