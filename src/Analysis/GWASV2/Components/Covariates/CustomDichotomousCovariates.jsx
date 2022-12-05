import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CohortSelect from '../SelectCohort/SelectCohort';
import ACTIONS from '../../Shared/StateManagement/Actions';
import CohortsOverlapDiagram from '../Diagrams/CohortsOverlapDiagram/CohortsOverlapDiagram';

import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({
  dispatch,
  setMode,
  type,
  studyPopulationCohort,
  covariates,
  outcome,
}) => {
  const [firstPopulation, setFirstPopulation] = useState(undefined);
  const [secondPopulation, setSecondPopulation] = useState(undefined);
  const [providedName, setProvidedName] = useState('');

  const handleDichotomousSubmit = () => {
    const dichotomous = {
      variable_type: 'custom_dichotomous',
      cohort_ids: [
        firstPopulation.cohort_definition_id,
        secondPopulation.cohort_definition_id,
      ],
      provided_name: providedName,
    };
    dispatch(
      type === 'outcome'
        ? { type: ACTIONS.SET_OUTCOME, payload: dichotomous }
        : { type: ACTIONS.ADD_COVARIATE, payload: dichotomous },
    );
    setMode('');
  };

  const customDichotomousValidation = providedName.length === 0
    || firstPopulation === undefined
    || secondPopulation === undefined;

  return (
    <div>
      <div className='GWASUI-flexRow' style={{width: '1450px'}} data-tour='name'>
        <input
          type='text'
          className={'GWASUI-providedName'}
          onChange={(e) => setProvidedName(e.target.value)}
          value={providedName}
          placeholder='Provide a name...'
          style={{
            width: '50%',
            textSize: 'small',
            paddingLeft: 5,
            height: 45,
            borderRadius: 5,
            marginTop: 5,
          }}
        />
        <button
          type='button'
          className={'GWASUI-dichBtn'}
          onClick={() => setMode(undefined)}
        >
          cancel
        </button>
        <div data-tour='add-button'>
          <button
            type='button'
            disabled={customDichotomousValidation}
            className={`${
              !customDichotomousValidation ? 'GWASUI-btnEnable' : ''
            } GWASUI-dichBtn`}
            onClick={() => handleDichotomousSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
      <React.Fragment>
        <div data-tour='choosing-dichotomous'>
          <div className='GWASUI-flexRow' data-tour='table-repeat'>
            <div>
              <h3>Select NO Cohort</h3>
              <CohortSelect
                selectedCohort={firstPopulation}
                handleCohortSelect={setFirstPopulation}
              />
            </div>
            <div>
              <h3>Select YES Cohort</h3>
              <CohortSelect
                selectedCohort={secondPopulation}
                handleCohortSelect={setSecondPopulation}
              />
            </div>
            <div style={{ paddingLeft: '30px' }}>
              <h3>Cohort overlap diagram</h3>
              { !firstPopulation || !secondPopulation ? (
                <div style={{ width: '200px' }}>Select your cohorts to assess overlap</div>
              ) : (
                <CohortsOverlapDiagram
                  selectedStudyPopulationCohort={studyPopulationCohort}
                  selectedCaseCohort={firstPopulation}
                  selectedControlCohort={secondPopulation}
                  selectedCovariates={covariates}
                  outcome={outcome}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
      <div />
    </div>
  );
};

CustomDichotomousCovariates.propTypes = {
  setMode: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  covariates: PropTypes.array,
  outcome: PropTypes.object,
};

CustomDichotomousCovariates.defaultProps = {
  covariates: [],
  outcome: null,
};

export default CustomDichotomousCovariates;
