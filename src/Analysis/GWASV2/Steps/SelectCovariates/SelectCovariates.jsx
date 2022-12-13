import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import CovariatesCardsList from '../../Components/Covariates/CovariatesCardsList';
import ACTIONS from '../../Shared/StateManagement/Actions';
import './SelectCovariates.css';
import '../../GWASV2.css';

const SelectCovariates = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
}) => {
  const [selectionMode, setSelectionMode] = useState('');

  return (
    <React.Fragment>
      <div className='GWASUI-row'>
        <div className='GWASUI-double-column'>
          {selectionMode === 'continuous' && (
            <ContinuousCovariates
              covariates={covariates}
              outcome={outcome}
              handleClose={() => {
                setSelectionMode('');
              }}
              dispatch={(chosenCovariate) => {
                dispatch({
                  type: ACTIONS.ADD_COVARIATE,
                  payload: chosenCovariate,
                });
              }}
              submitButtonLabel={'Add'}
            />
          )}

          {selectionMode === 'dichotomous' && (
            <CustomDichotomousCovariates
              studyPopulationCohort={studyPopulationCohort}
              covariates={covariates}
              outcome={outcome}
              handleClose={() => {
                setSelectionMode('');
              }}
              dispatch={(chosenCovariate) => {
                dispatch({
                  type: ACTIONS.ADD_COVARIATE,
                  payload: chosenCovariate,
                });
              }}
              submitButtonLabel={'Add'}
            />
          )}
          {!selectionMode && (
            <div className='GWASUI-selectionUI'>
              <button
                type='button'
                onClick={() => setSelectionMode('continuous')}
              >
                <span>+</span>
                <span>Add Continuous Outcome Covariate</span>
              </button>

              <button
                type='button'
                onClick={() => setSelectionMode('dichotomous')}
              >
                <span>+</span>
                <span>Add Dichotomous Outcome Covariate</span>
              </button>
            </div>
          )}
        </div>

        <div
          className='GWASUI-column'
          style={{
            background: '#E9EEF2',
            padding: '15px',
            width: '206px',
            height: '520px',
          }}
        >
          <CovariatesCardsList
            covariates={covariates}
            deleteCovariate={(chosenCovariate) =>
              dispatch({
                type: ACTIONS.DELETE_COVARIATE,
                payload: chosenCovariate,
              })
            }
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
