import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectCohortDropDown from '../SelectCohort/SelectCohortDropDown';
import CohortsOverlapDiagram from '../Diagrams/CohortsOverlapDiagram/CohortsOverlapDiagram';

import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({
  dispatch,
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
    dispatch(dichotomous);
    handleClose();
  };

  const customDichotomousValidation = providedName.length === 0
    || firstPopulation === undefined
    || secondPopulation === undefined;

  return (
    <div style={{ minHeight: '300px' }}>
      <div className='GWASUI-flexRow' data-tour='name'>
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
            borderRadius: 5,
          }}
        />
        <button
          type='button'
          className={'GWASUI-dichBtn'}
          onClick={() => handleClose()}
        >
          Cancel
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
            <div className='GWASUI-flexColumn'>
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
            <div style={{ paddingLeft: '30px' }}>
              <h3>Cohort overlap diagram</h3>
              {!firstPopulation || !secondPopulation ? (
                <div>Select your cohorts to assess overlap</div>
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
  covariates: [],
  outcome: null,
  submitButtonLabel: 'Submit',
};

export default CustomDichotomousCovariates;
