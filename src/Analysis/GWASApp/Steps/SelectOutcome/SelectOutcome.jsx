import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CovariatesCardsList from '../../Components/Covariates/CovariatesCardsList';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Utils/StateManagement/Actions';
import '../../GWASApp.css';

const SelectOutcome = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
  selectedTeamProject,
}) => {
  const [selectionMode, setSelectionMode] = useState('');
  useEffect(
    () => () => dispatch({
      type: ACTIONS.SET_SELECTION_MODE,
      payload: '',
    }),
    [],
  );

  const determineSelectOutcomeJsx = () => {
    if (selectionMode === 'continuous') {
      return (
        <div className='select-container'>
          <ContinuousCovariates
            dispatch={dispatch}
            selectedStudyPopulationCohort={studyPopulationCohort}
            outcome={null}
            handleClose={() => {
              setSelectionMode('');
              dispatch({
                type: ACTIONS.SET_SELECTION_MODE,
                payload: '',
              });
            }}
            handleSelect={(chosenOutcome) => {
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
        <div className='select-container'>
          <CustomDichotomousCovariates
            dispatch={dispatch}
            studyPopulationCohort={studyPopulationCohort}
            outcome={null}
            handleClose={() => {
              setSelectionMode('');
              dispatch({
                type: ACTIONS.SET_SELECTION_MODE,
                payload: '',
              });
            }}
            handleSelect={(chosenOutcome) => {
              dispatch({
                type: ACTIONS.SET_OUTCOME,
                payload: chosenOutcome,
              });
            }}
            selectedTeamProject={selectedTeamProject}
          />
        </div>
      );
    }

    return (
      <div className='GWASUI-selectionUI'>
        <button
          data-tour='select-outcome-continious'
          type='button'
          onClick={() => {
            setSelectionMode('continuous');
            dispatch({
              type: ACTIONS.SET_SELECTION_MODE,
              payload: 'continuous',
            });
          }}
        >
          <span>+</span>
          <span>Add Continuous Outcome Phenotype</span>
        </button>
        <button
          data-tour='select-outcome-dichotomous'
          type='button'
          onClick={() => {
            setSelectionMode('dichotomous');
            dispatch({
              type: ACTIONS.SET_SELECTION_MODE,
              payload: 'dichotomous',
            });
          }}
        >
          <span>+</span>
          <span>Add Dichotomous Outcome Phenotype</span>
        </button>
      </div>
    );
  };

  // Outputs the JSX for the component:
  return (
    <div className='GWASUI-row'>
      <div data-tour='select-outcome' className='GWASUI-double-column'>
        {determineSelectOutcomeJsx()}
      </div>
      <div className='GWASUI-column GWASUI-card-column'>
        <CovariatesCardsList
          covariates={covariates}
          outcome={outcome}
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
  covariates: PropTypes.array,
  selectedTeamProject: PropTypes.string.isRequired,
};

SelectOutcome.defaultProps = {
  outcome: null,
  covariates: [],
};

export default SelectOutcome;
