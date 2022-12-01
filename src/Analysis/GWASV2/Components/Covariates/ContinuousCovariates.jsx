import React from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const ContinuousCovariates = ({
  setMode,
  selected,
  dispatch,
  handleSelect,
  type,
}) => {
  const formatSelected = () => ({
    variable_type: 'concept',
    concept_id: selected.concept_id,
    concept_name: selected.concept_name,
  });
  return (
    <React.Fragment>
      <Covariates selected={selected} handleSelect={handleSelect} />
      <button
        type='button'
        style={{ marginLeft: 5 }}
        onClick={() => {
          dispatch(
            type === 'outcome'
              ? {
                  type: ACTIONS.SET_OUTCOME,
                  payload: formatSelected(selected),
                }
              : {
                  type: ACTIONS.ADD_COVARIATE,
                  payload: formatSelected(selected),
                }
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
};

ContinuousCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
  setMode: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ContinuousCovariates;
