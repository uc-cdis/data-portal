import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import PhenotypeHistogram from '../Diagrams/PhenotypeHistogram/PhenotypeHistogram';

const ContinuousCovariates = ({
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  dispatch,
  handleClose,
  submitButtonLabel,
}) => {
  const [selected, setSelected] = useState(null);

  const formatSelected = () => ({
    variable_type: 'concept',
    concept_id: selected.concept_id,
    concept_name: selected.concept_name,
  });

  return (
    <React.Fragment>
      <div className='GWASUI-flexRow' style={{ width: '850px' }} data-tour='name'>
        <div>
          <div>
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
          </div>
        </div>
        <div style={{ paddingLeft: '30px' }}>
          {selected
            ? (
              <PhenotypeHistogram
                selectedStudyPopulationCohort={selectedStudyPopulationCohort}
                selectedCovariates={selectedCovariates}
                outcome={outcome}
                selectedConceptId={selected.concept_id}
              />
            )
            : 'Select a variable'}
        </div>
      </div>
    </React.Fragment>
  );
};

ContinuousCovariates.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string,
};
ContinuousCovariates.defaultProps = {
  selectedCovariates: [],
  outcome: null,
  submitButtonLabel: 'Submit',
};

export default ContinuousCovariates;
