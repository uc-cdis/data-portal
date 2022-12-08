import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectOutcome = ({ covariates, dispatch, outcome }) => {
  const [variableType, setVariableType] = useState(undefined);
  const [selectedOutcome, setSelectedOutcome] = useState({});

  let outcomeMenu =
    variableType === 'continuous' ?
      <ContinuousCovariates
        setVariableType={setVariableType}
        selected={selectedOutcome}
        dispatch={dispatch}
        handleSelect={setSelectedOutcome}
        covariates={covariates}
        outcome={outcome}
        type={'outcome'}
      /> :
      <CustomDichotomousCovariates
        setVariableType={setVariableType}
        dispatch={dispatch}
        covariates={covariates}
        outcome={outcome}
        type={'outcome'}
      />
  return (<>
    <div
      style={{
        width: '90%',
        margin: 'auto',
        height: '550px',
      }}
    >
      {variableType && outcomeMenu}
      {!variableType && <div style={{
        height: '90%',
        display: "flex",
        flexDirection: "row"
      }}>
        <button
          type='button'
          style={{
            height: 100,
            width: 250,
            margin: 'auto'
          }}
          onClick={() => setVariableType('continuous')}
        >
          <div style={{
            width: 240,
            display: "flex",
            flexDirection: "row",
            margin: "0 auto"
          }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}>
              <div style={{
                width: 35,
                height: 30,
                backgroundColor: "orange",
                fontWeight: "bold",
                fontSize: 30,
                color: "white",
                borderRadius: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10
              }}>+</div>
              <div style={{
                fontSize: 15,
                color: "#4375B3",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                Add Continuous Outcome Phenotype
              </div>
            </div>
          </div>
        </button>
        <button
          type='button'
          style={{
            height: 100,
            width: 250,
            margin: 'auto'
          }}
          onClick={() => setVariableType('dichotomous')}
        >
          <div style={{
            width: 240,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
          }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}>
              <div style={{
                width: 35,
                height: 30,
                backgroundColor: "orange",
                fontWeight: "bold",
                fontSize: 30,
                color: "white",
                borderRadius: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10
              }}>+</div>
              <div style={{
                fontSize: 15,
                color: "#4375B3",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                Add Dichotomous Outcome Phenotype
              </div>
            </div>
          </div>
        </button>
      </div>}
    </div>
  </>)
}

SelectOutcome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: null,
};

export default SelectOutcome;
