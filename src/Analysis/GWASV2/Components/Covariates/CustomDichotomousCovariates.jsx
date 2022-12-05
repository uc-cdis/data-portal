import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CohortSelect from '../SelectCohort/SelectCohort';
import CohortsOverlapDiagram from '../Diagrams/CohortsOverlapDiagram/CohortsOverlapDiagram';

import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({
  dispatch,
  handleClose,
  covariates,
  studyPopulationCohort,
  outcome,
  submitButtonLabel = 'Submit',
}) => {
  const [firstPopulation, setFirstPopulation] = useState(null);
  const [secondPopulation, setSecondPopulation] = useState(null);
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
    dispatch(dichotomous);
    handleClose();
  };

  const customDichotomousValidation =
    providedName.length === 0 ||
    firstPopulation === undefined ||
    secondPopulation === undefined;

  return (
    <div>
      <div
        className='GWASUI-flexRow'
        style={{ width: '1450px' }}
        data-tour='name'
      >
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
          onClick={() => handleClose()}
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
            {submitButtonLabel}
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
              {!firstPopulation || !secondPopulation ? (
                <div style={{ width: '200px' }}>
                  Select your cohorts to assess overlap
                </div>
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
  dispatch: PropTypes.func.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  covariates: PropTypes.array,
  outcome: PropTypes.object,
  submitButtonLabel: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

CustomDichotomousCovariates.defaultProps = {
  submitButtonLabel: 'Submit',
};

export default CustomDichotomousCovariates;
