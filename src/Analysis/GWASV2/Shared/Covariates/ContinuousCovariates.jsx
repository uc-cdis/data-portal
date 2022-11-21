import React from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import ACTIONS from '../StateManagement/Actions';

const ContinuousCovariates = ({
  setMode,
  selected,
  dispatch,
  handleSelect,
  type,
}) => (
  <React.Fragment>
    <Covariates selected={selected} handleSelect={handleSelect} />
    <button
      type='button'
      style={{ marginLeft: 5 }}
      onClick={() => {
        dispatch(
          type === 'outcome'
            ? { type: ACTIONS.SET_OUTCOME, payload: selected }
            : { type: ACTIONS.ADD_COVARIATE, payload: selected },
        );
        setMode('');
      }}
    >
      Submit
    </button>
    <button
      type='button'
      onClick={() => {
        setMode(undefined);
      }}
    >
      cancel
    </button>
  </React.Fragment>
);

ContinuousCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
  setMode: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ContinuousCovariates;
