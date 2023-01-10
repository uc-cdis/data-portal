import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CovariatesCardsList from '../../Components/Covariates/CovariatesCardsList';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Utils/StateManagement/Actions';
import './SelectOutcome.css';
import '../../GWASV2.css';

const SelectOutcome = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
}) => {
  const [selectionMode, setSelectionMode] = useState('');

  const determineSelectOutcomeJsx = () => {
    if (selectionMode === 'continuous') {
      return (
        <div className='select-outcome-container'>
          <ContinuousCovariates
            selectedStudyPopulationCohort={studyPopulationCohort}
            outcome={outcome}
            handleClose={() => {
              setSelectionMode('');
            }}
            dispatch={(chosenOutcome) => {
              dispatch({
                type: ACTIONS.SET_OUTCOME,
                payload: chosenOutcome,
              });
            }}
          />
        </div>
      );
    }
    if (selectionMode === 'dichotomous') {
      return (
        <div className='select-outcome-container'>
          <CustomDichotomousCovariates
            studyPopulationCohort={studyPopulationCohort}
            outcome={outcome}
            handleClose={() => {
              setSelectionMode('');
            }}
            dispatch={(chosenOutcome) => {
              dispatch({
                type: ACTIONS.SET_OUTCOME,
                payload: chosenOutcome,
              });
            }}
          />
        </div>
      );
    }

    return (
      <div className='GWASUI-selectionUI'>
        <button type='button' onClick={() => setSelectionMode('continuous')}>
          <span>+</span>
          <span>Add Continuous Outcome Phenotype</span>
        </button>
        <button type='button' onClick={() => setSelectionMode('dichotomous')}>
          <span>+</span>
          <span>Add Dichotomous Outcome Phenotype</span>
        </button>
      </div>
    );
  };

  // Outputs the JSX for the component:
  return (
    <div className='GWASUI-row'>
      <div className='GWASUI-double-column'>{determineSelectOutcomeJsx()}</div>
      <div className='GWASUI-column GWASUI-card-column'>
        <CovariatesCardsList
          covariates={covariates}
          deleteCovariate={(chosenCovariate) => dispatch({
            type: ACTIONS.DELETE_COVARIATE,
            payload: chosenCovariate,
          })}
        />
      </div>
    </div>
  );
};

SelectOutcome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  outcome: PropTypes.object,
  covariates: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: null,
  covariates: null,
};

export default SelectOutcome;
