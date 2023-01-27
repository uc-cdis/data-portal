import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectCohortDropDown from '../SelectCohort/SelectCohortDropDown';
import CohortsOverlapDiagram from '../Diagrams/CohortsOverlapDiagram/CohortsOverlapDiagram';
import './Covariates.css';
import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({
  dispatch,
  handleSelect,
  handleClose,
  studyPopulationCohort,
  covariates,
  outcome,
  submitButtonLabel,
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
    handleSelect(dichotomous);
    handleClose();
  };

  const customDichotomousValidation =
    providedName.length === 0 ||
    firstPopulation === undefined ||
    secondPopulation === undefined;

  return (
    <div className='custom-dichotomous-covariates'>
      <div className='GWASUI-flexRow'>
        <label htmlFor='phenotype-input'>Phenotype Name</label>
        <input
          type='text'
          id='phenotype-input'
          className={'GWASUI-providedName'}
          data-tour='name-input'
          onChange={(e) => setProvidedName(e.target.value)}
          value={providedName}
          placeholder='Provide a name...'
        />
        <span
          className='dichotomous-button-wrapper'
          data-tour='submit-cancel-buttons'
        >
          <button
            type='button'
            className='GWASUI-dichBtn cancel-button'
            onClick={() => handleClose()}
          >
            Cancel
          </button>
          <div>
            <button
              type='button'
              disabled={customDichotomousValidation}
              className={`submit-button ${
                !customDichotomousValidation ? 'GWASUI-btnEnable' : ''
              } GWASUI-dichBtn`}
              onClick={() => handleDichotomousSubmit()}
            >
              {submitButtonLabel}
            </button>
          </div>
        </span>
      </div>
      <React.Fragment>
        <div>
          <div className='GWASUI-flexRow'>
            <div
              data-tour='select-dichotomous'
              className='GWASUI-flexColumn dichotomous-selection'
            >
              <div className='dichotomous-directions'>
                Define a dichotomous variable by study population with 2 other
                cohorts.
              </div>
              <div>
                <h3>Get Value 0</h3>
                <SelectCohortDropDown handleCohortSelect={setFirstPopulation} />
              </div>
              <div>
                <h3>Get Value 1</h3>
                <SelectCohortDropDown
                  handleCohortSelect={setSecondPopulation}
                />
              </div>
            </div>
            <div
              data-tour='cohorts-overlap-diagram'
              className='cohorts-overlap-diagram'
            >
              {!firstPopulation || !secondPopulation ? (
                <div>Select your cohorts to assess overlap</div>
              ) : (
                <CohortsOverlapDiagram
                  dispatch={dispatch}
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
  handleSelect: PropTypes.func.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  covariates: PropTypes.array,
  outcome: PropTypes.object,
  submitButtonLabel: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

CustomDichotomousCovariates.defaultProps = {
  covariates: [],
  outcome: null,
  submitButtonLabel: 'Submit',
};

export default CustomDichotomousCovariates;
