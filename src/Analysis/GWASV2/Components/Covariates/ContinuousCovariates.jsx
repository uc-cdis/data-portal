import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';

const ContinuousCovariates = ({
  dispatch,
  handleClose,
  submitButtonLabel = 'Submit',
}) => {
  const [selected, setSelected] = useState({});

  const formatSelected = () => ({
    variable_type: 'concept',
    concept_id: selected.concept_id,
    concept_name: selected.concept_name,
  });

  return (
    <React.Fragment>
      <Covariates selected={selected} handleSelect={setSelected} />
      <button
        type='button'
        style={{ marginLeft: 5 }}
        onClick={() => {
          dispatch(formatSelected(selected));
          handleClose();
        }}
      >
        {submitButtonLabel}
      </button>
      <button
        type='button'
        onClick={() => {
          handleClose();
        }}
      >
        Cancel
      </button>
    </React.Fragment>
  );
};

ContinuousCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string,
};
ContinuousCovariates.defaultProps = {
  submitButtonLabel: 'Submit',
};

export default ContinuousCovariates;
