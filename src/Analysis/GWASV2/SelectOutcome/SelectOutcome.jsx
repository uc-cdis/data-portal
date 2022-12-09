import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';
import { pseudoTw } from '../Shared/constants';

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
  const { flex, width, margin, height, bg, text } = pseudoTw;
  return (<>
    <div
      style={{
        ...width.size("100%"),
        ...margin.auto("default"),
        ...height.size(550)
      }}
    >
      {variableType && outcomeMenu}
      {!variableType && <div style={{
        ...height.size("90%"),
        ...flex.direction("row")
      }}>
        <button
          type='button'
          style={{
            ...height.size(100),
            ...width.size(250),
            ...margin.auto("default")
          }}
          onClick={() => setVariableType('continuous')}
        >
          <div style={{
            ...width.size(240),
            ...flex.direction("row"),
            ...margin.auto("x")
          }}>
            <div
              style={{
                ...flex.direction("row")
              }}>
              <div style={{
                ...width.size(35),
                ...height.size(30),
                ...bg.color("orange"),
                fontWeight: "bold",
                fontSize: 30,
                ...text.color("white"),
                borderRadius: 5,
                ...flex.direction("row"),
                justifyContent: "center",
                alignItems: "center",
              }}>+</div>
              <div style={{
                fontSize: 15,
                ...text.color("#4375B3"),
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
            ...width.size(240),
            ...flex.direction("row"),
            justifyContent: "space-around"
          }}>
            <div
              style={{
                ...flex.direction("row")
              }}>
              <div style={{
                 ...width.size(35),
                 ...height.size(30),
                 ...bg.color("orange"),
                 fontWeight: "bold",
                 fontSize: 30,
                 ...text.color("white"),
                 borderRadius: 5,
                 ...flex.direction("row"),
                 justifyContent: "center",
                 alignItems: "center",
              }}>+</div>
              <div style={{
                fontSize: 15,
                ...text.color("#4375B3"),
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
