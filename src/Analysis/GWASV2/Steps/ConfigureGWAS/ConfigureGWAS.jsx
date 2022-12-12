import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Modal } from 'antd';
import SelectHareDropDown from '../SelectHare/SelectHareDropDown';

const twSudo = {
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between"
  },
};
// todo react tour

const ConfigureGWAS = ({
  dispatch,
  numOfPCs,
  mafThreshold,
  imputationScore,
  covariates,
  selectedCohort,
  selectedHare,
  outcome
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalShow = () => {
    setModalVisible(true);
  }
  const modalCancel = () => {
    setModalVisible(false);
  }
  // GWASUI label css
  // margin: 5px;
  // padding: 2px;
  // width: auto;
  // display: inline-block;
  // white-space: nowrap;
  // text-overflow: ellipsis;

  const { flexCol, flexRow } = twSudo;
  // enable when fields valid (refer to WorkflowParameters.jsx & GWASFormSubmit.jsx)
  return (
    <React.Fragment>
      <div style={flexCol}>
        <div style={flexRow}>
          <div style={flexCol}>
            <SelectHareDropDown
              selectedHare={selectedHare}
              selectedCohort={selectedCohort}
              covariates={covariates}
              outcome={outcome}
              handleHareChange={dispatch}
            />
            <label
              // className='GWASUI-label GWASUI-asterisk'
              htmlFor='input-numOfPC'>
              Number of PCs to use &nbsp;
              <InputNumber
                id='input-numOfPC'
                value={numOfPCs}
                min={1}
                max={10}
                onChange={(e) => dispatch({
                  accessor: "numOfPC",
                  payload: Number(e)
                })}
              />
              {/* {(!numOfPC) && (<span style={{ color: 'red' }}> Please input a value between 1 and 10</span>)} */}
            </label>
          </div>
          <div style={flexCol}>
            <label
              // className='GWASUI-label'
              htmlFor='input-maf'>
              MAF Cutoff &nbsp;
              <InputNumber
                id='input-maf'
                value={mafThreshold}
                onChange={(e) => dispatch({
                  accessor: "mafThreshold",
                  payload: Number(e),
                })}
                stringMode
                step='0.01'
                min={'0'}
                max={'0.5'}
              />
            </label>
          </div>
        </div>
        <div style={flexRow}>
          <div>
          </div>
          <div style={flexCol}>
            <label
              // className='GWASUI-label'
              htmlFor='input-imputation'>
              Imputation Score Cutoff &nbsp;
              <InputNumber
                id='input-imputation'
                value={imputationScore}
                onChange={(e) => dispatch({
                  accessor: "imputationScore",
                  payload: Number(e),
                })}
                stringMode
                step='0.1'
                min={'0'}
                max={'1'}
              />
            </label>
          </div>
        </div>
        {/* <div style={flexRow}><button>Submit</button></div> */}
        <Modal
          title={<div style={{...flexRow, ...{ justifyContent: "space-between" }}}>
            <div>Review Details</div>
            {/* <button onClick={modalCancel}>X</button> */}
          </div>}
          open={modalVisible}
          onCancel={modalCancel}
          // onOk={() => {
          //   submission code here (onSuccess: setModalVisible(false))
          //   setModalVisible(false)
          // }}
          >
          <div style={flexCol}>
            <div style={flexRow}>
              <div>Number of PCs</div><div>{numOfPCs}</div>
            </div>
            <div style={flexRow}>
            <div>MAF Cutoff</div><div>{mafThreshold}</div>
            </div>
            <div style={flexRow}>
            <div>HARE Ancestry</div><div>{selectedHare?.concept_value_name}</div>
            </div>
            <div style={flexRow}>
            <div>Imputation Score Cutoff</div><div>{imputationScore}</div>
            </div>
            <hr />
            <div style={flexRow}>
            <div>Cohort</div><div>{selectedCohort?.cohort_name}</div>
            </div>
            <div style={flexRow}>
            <div>Phenotype</div><div>{outcome?.concept_name ?? outcome?.provided_name}</div>
            </div>
            <div style={flexRow}>
            <div>Final Size</div><div>{'final size'}</div>
            </div>
            <div style={flexRow}>
            <div onClick={() => console.log('cov', covariates)}>Covariates</div>
            <div style={flexCol, { overflowY: 300 }}>
              {covariates.map((cov, key) => {
                return <div key={key}>{cov?.concept_name ?? cov.provided_name}</div>
              })}
              </div>
            </div>
            <div style={flexRow}>
            <div>Minimum Outlier Cutoff</div><div>{'min outlier cutoff'}</div>
            </div>
            <div style={flexRow}>
            <div>Maximum Outlier Cutoff</div><div>{'max outlier cutoff'}</div>
            </div>
          </div>
        </Modal>
          <button onClick={modalShow}>open modal</button>
      </div>
    </React.Fragment>
  );
};

ConfigureGWAS.propTypes = {
  dispatch: PropTypes.func.isRequired,
  numOfPCs: PropTypes.number,
  mafThreshold: PropTypes.number,
  imputationScore: PropTypes.number,
  covariates: PropTypes.array,
  selectedCohort: PropTypes.object,
  selectedHare: PropTypes.object,
  outcome: PropTypes.object
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
};

export default ConfigureGWAS;
