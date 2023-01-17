import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import PhenotypeHistogram from '../Diagrams/PhenotypeHistogram/PhenotypeHistogram';
import './Covariates.css';

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
      <div className='GWASUI-flexRow continuous-covariates' data-tour='name'>
        <div className='continous-covariates-table'>
          <Covariates selected={selected} handleSelect={setSelected} />
        </div>
        <div className='phenotype-histogram'>
          <div className='continuous-covariates-button-container'>
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
              onClick={() => {
                dispatch(formatSelected(selected));
                handleClose();
              }}
            >
              {submitButtonLabel}
            </button>
          </div>
          {selected ? (
            <PhenotypeHistogram
              selectedStudyPopulationCohort={selectedStudyPopulationCohort}
              selectedCovariates={selectedCovariates}
              outcome={outcome}
              selectedContinuousItem={selected}
            />
          ) : (
            <div className='phenotype-histogram-directions'>
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
  handleClose: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string,
};
ContinuousCovariates.defaultProps = {
  selectedCovariates: [],
  outcome: null,
  submitButtonLabel: 'Submit',
};

export default ContinuousCovariates;
