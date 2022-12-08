import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SelectCohortDropDown from '../SelectCohortDropDown/SelectCohortDropDown';
import '../../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousCovariates = ({ dispatch, setVariableType, type, covariates }) => {
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
      { accessor: type, payload: type === "outcome" ? dichotomous : [...covariates, dichotomous] }
    );
    setVariableType(undefined);
    if (type === "outcome") {
      dispatch({
        accessor: "currentStep", payload: 2
      })
    }
  };

  const customDichotomousValidation = providedName.length === 0
    || firstPopulation === undefined
    || secondPopulation === undefined;

  return (
    <div
      style={{ margin: "auto", height: "inherit" }}
      data-tour='choosing-dichotomous'>
      <div
        style={{ display: "flex", flexDirection: "row", width: "60%", justifyContent: "space-between", marginBottom: 100 }}
        data-tour='table-repeat'>
        <div style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
          <span>Get Value 0</span>
          <SelectCohortDropDown
            handleCohortSelect={setFirstPopulation}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
          <span>Get Value 1</span>
          <SelectCohortDropDown
            handleCohortSelect={setSecondPopulation}
          />
        </div>
      </div>
      <div
        data-tour="name"
        style={{ display: "flex", flexDirection: "row", width: "60%" }}
      >
        <input
          type='text'
          onChange={(e) => setProvidedName(e.target.value)}
          value={providedName}
          placeholder='Provide a name...'
          style={{
            width: '50%',
            textSize: 'small',
            height: 45,
            borderRadius: 5,
            margin: "0 auto"
          }}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", width: "60%", marginTop: 100 }}
      >
        <div
          style={{ margin: "0 auto" }}
        >
          <button
            type='button'
            onClick={() => setVariableType(undefined)}
          >
            cancel
          </button>
        </div>
        <div
          style={{ margin: "0 auto" }}
          data-tour='add-button'>
          <button
            type='button'
            disabled={customDichotomousValidation}
            className={`${!customDichotomousValidation ? 'GWASUI-btnEnable' : ''
              } GWASUI-dichBtn`}
            onClick={() => handleDichotomousSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
      <div />
    </div>
  );
};

CustomDichotomousCovariates.propTypes = {
  setVariableType: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  covariates: PropTypes.array
};

CustomDichotomousCovariates.defaultProps = {
  covariates: []
}

export default CustomDichotomousCovariates;
