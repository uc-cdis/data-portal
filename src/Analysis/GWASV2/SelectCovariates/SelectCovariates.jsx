import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectCovariates = ({ dispatch, covariates, outcome }) => {
  const [variableType, setVariableType] = useState(undefined);
  const [selectedCovariate, setSelectedCovariate] = useState({});

  let covariateMenu = variableType === 'continuous' ? (
    // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
    <ContinuousCovariates
      setVariableType={setVariableType}
      selected={selectedCovariate}
      dispatch={dispatch}
      handleSelect={setSelectedCovariate}
      covariates={covariates}
      outcome={outcome}
      type={'covariates'}
    />
  ) : (
    // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
    <CustomDichotomousCovariates
      setVariableType={setVariableType}
      dispatch={dispatch}
      covariates={covariates}
      outcome={outcome}
      type={'covariates'}
    />
  )
  return (
    <div
      style={{
        width: '90%',
        height: '550px',
      }}
    >
      {variableType && covariateMenu}
      {!variableType && (
        <div style={{
          height: '80%',
          display: "flex",
          flexDirection: "row"
        }}>
          <button
            type='button'
            style={{
              height: 100,
              width: 250,
              border: "1px solid #4375B3",
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
                  fontWeight: "bold",
                  marginLeft: 10
                }}>
                  Add Continuous Covariate
                </div>
              </div>
            </div>
          </button>
          <button
            type='button'
            style={{
              height: 100,
              width: 250,
              border: "1px solid #4375B3",
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
                  fontWeight: "bold",
                  marginLeft: 10
                }}>
                  Add Dichotomous Covariate
                </div>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

SelectCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object.isRequired,
};

export default SelectCovariates;
