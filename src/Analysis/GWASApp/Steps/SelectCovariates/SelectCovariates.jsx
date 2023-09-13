import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import CovariatesCardsList from '../../Components/Covariates/CovariatesCardsList';
import ACTIONS from '../../Utils/StateManagement/Actions';
import initialState from '../../Utils/StateManagement/InitialState';
import './SelectCovariates.css';
import '../../GWASApp.css';

const SelectCovariates = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
}) => {
  const [selectionMode, setSelectionMode] = useState('');
  useEffect(
    () => () => {dispatch({
      type: ACTIONS.SET_SELECTION_MODE,
      payload: '',
    })
    dispatch({
      type: ACTIONS.UPDATE_SELECTED_HARE,
      payload: initialState.selectedHare,
    });},
    [],
  );

  return (
    <React.Fragment>
      <div className='GWASUI-row'>
        <div data-tour='select-covariate' className='GWASUI-double-column'>
          {selectionMode === 'continuous' && (
            <div className='select-container'>
              <ContinuousCovariates
                dispatch={dispatch}
                selectedStudyPopulationCohort={studyPopulationCohort}
                selectedCovariates={covariates}
                outcome={outcome}
                handleClose={() => {
                  setSelectionMode('');
                  dispatch({
                    type: ACTIONS.SET_SELECTION_MODE,
                    payload: '',
                  });
                }}
                handleSelect={(chosenCovariate) => {
                  dispatch({
                    type: ACTIONS.ADD_COVARIATE,
                    payload: chosenCovariate,
                  });
                }}
                submitButtonLabel={'Add'}
              />
            </div>
          )}

          {selectionMode === 'dichotomous' && (
            <div className='select-container'>
              <CustomDichotomousCovariates
                dispatch={dispatch}
                studyPopulationCohort={studyPopulationCohort}
                covariates={covariates}
                outcome={outcome}
                handleClose={() => {
                  setSelectionMode('');
                  dispatch({
                    type: ACTIONS.SET_SELECTION_MODE,
                    payload: '',
                  });
                }}
                handleSelect={(chosenCovariate) => {
                  dispatch({
                    type: ACTIONS.ADD_COVARIATE,
                    payload: chosenCovariate,
                  });
                }}
                submitButtonLabel={'Add'}
              />
            </div>
          )}
          {!selectionMode && (
            <div className='GWASUI-selectionUI'>
              <button
                data-tour='select-covariate-continious'
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
                <span>Add Continuous Covariate</span>
              </button>

              <button
                data-tour='select-covariate-dichotomous'
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
                <span>Add Dichotomous Covariate</span>
              </button>
            </div>
          )}
        </div>

        <div
          data-tour='covariates-card'
          className='GWASUI-column GWASUI-card-column'
        >
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
    </React.Fragment>
  );
};

SelectCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  outcome: PropTypes.object.isRequired,
  covariates: PropTypes.array.isRequired,
};

export default SelectCovariates;
