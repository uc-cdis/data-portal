import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SelectStudyPopulation from '../../CohortSelect/CohortSelect';
import ACTIONS from '../StateManagement/Actions';
import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({
  dispatch,
  setMode,
  covariates = [],
  outcome,
  type,
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
        : { type: ACTIONS.ADD_COVARIATE, payload: dichotomous }
    );
    setMode('');
  };

  const customDichotomousValidation =
    providedName.length === 0 ||
    firstPopulation === undefined ||
    secondPopulation === undefined;

  return (
    <div>
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
              <SelectStudyPopulation
                selectedStudyPopulationCohort={firstPopulation}
                handleSelectStudyPopulation={setFirstPopulation}
                cd={true}
              />
            </div>
            <div>
              <h3>Select YES Cohort</h3>
              <SelectStudyPopulation
                selectedStudyPopulationCohort={secondPopulation}
                handleSelectStudyPopulation={setSecondPopulation}
                cd={true}
              />
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
  covariates: PropTypes.array,
  outcome: PropTypes.object,
  type: PropTypes.string.isRequired,
};

CustomDichotomousCovariates.defaultProps = {
  covariates: [],
  outcome: {},
};

export default CustomDichotomousCovariates;
