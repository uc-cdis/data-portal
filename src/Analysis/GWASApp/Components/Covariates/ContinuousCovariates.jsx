import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import PhenotypeHistogram from '../Diagrams/PhenotypeHistogram/PhenotypeHistogram';
import './Covariates.css';

const ContinuousCovariates = ({
  dispatch,
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  handleSelect,
  handleClose,
  submitButtonLabel,
}) => {
  const [selected, setSelected] = useState(null);

  const formatSelected = () => ({
    variable_type: 'concept',
    concept_id: selected.concept_id,
    concept_name: selected.concept_name,
  });

  // when a user has selected a outcome phenotype that is a continuous covariate with a concept ID,
  // that should not appear as a selectable option, and be included in the submitted covariates.
  // If they selected a outcome phenotype that is dichotomous
  // the outcome doesn't need to be included as a submitted covariate
  const submittedCovariateIds = outcome?.concept_id
    ? [outcome.concept_id, ...selectedCovariates.map((obj) => obj.concept_id)]
    : [...selectedCovariates.map((obj) => obj.concept_id)];

  return (
    <React.Fragment>
      <div className='GWASUI-flexRow continuous-covariates'>
        <div className='continuous-covariates-table'>
          <Covariates
            selected={selected}
            handleSelect={setSelected}
            submittedCovariateIds={submittedCovariateIds}
          />
        </div>
        <div className='phenotype-histogram'>
          <div data-tour='submit-cancel-buttons' className='continuous-covariates-button-container'>
            <button
              type='button'
              className='cancel-button'
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </button>
            <button
              className='submit-button'
              type='button'
              disabled={!selected}
              onClick={() => {
                handleSelect(formatSelected(selected));
                handleClose();
              }}
            >
              {submitButtonLabel}
            </button>
          </div>
          {selected ? (
            <div data-tour='phenotype-histogram'>
              <PhenotypeHistogram
                dispatch={dispatch}
                selectedStudyPopulationCohort={selectedStudyPopulationCohort}
                selectedCovariates={selectedCovariates}
                outcome={outcome}
                selectedContinuousItem={selected}
              />
            </div>
          ) : (
            <div data-tour='phenotype-histogram' className='phenotype-histogram-directions'>
              Select a concept to render its corresponding histogram
            </div>
          )}
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
  handleSelect: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string,
};
ContinuousCovariates.defaultProps = {
  selectedCovariates: [],
  outcome: null,
  submitButtonLabel: 'Submit',
};

export default ContinuousCovariates;
