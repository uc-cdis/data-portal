import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Modal, Input } from 'antd';
import SelectHareDropDown from '../../Components/SelectHare/SelectHareDropDown';

import ACTIONS from '../../Shared/StateManagement/Actions';
import DismissibleMessage from '../../Shared/DismissibleMessage/DismissibleMessage';

const twSudo = {
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  outcome,
  showModal,
}) => {
  const { flexCol, flexRow } = twSudo;

  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [jobName, setJobName] = useState('');

  const handleEnterJobName = (e) => {
    setJobName(e.target.value);
  };

  useEffect(() => {
    if (showModal === true) {
      setOpen(true);
    }
  }, [showModal]);

  const handleSubmit = () => {
    setOpen(false);
    setShowSuccess(true);
  };

  // enable when fields valid (refer to WorkflowParameters.jsx & GWASFormSubmit.jsx)
  return (
    <React.Fragment>
      {showSuccess && (
        <DismissibleMessage
          title={`Congratulations on your submission for ${jobName}`}
          description={'Your job number is: 3.1415'}
        />
      )}
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
              htmlFor='input-numOfPC'
            >
              Number of PCs to use &nbsp;
              <InputNumber
                id='input-numOfPC'
                value={numOfPCs}
                min={1}
                max={10}
                onChange={(e) => dispatch({ type: ACTIONS.UPDATE_NUM_PCS, payload: Number(e) })}
              />
              {/* {(!numOfPC) && (<span style={{ color: 'red' }}> Please input a value between 1 and 10</span>)} */}
            </label>
          </div>
          <div style={flexCol}>
            <label
              // className='GWASUI-label'
              htmlFor='input-maf'
            >
              MAF Cutoff &nbsp;
              <InputNumber
                id='input-maf'
                value={mafThreshold}
                onChange={(e) => dispatch({
                  type: ACTIONS.UPDATE_MAF_THRESHOLD,
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
          <div />
          <div style={flexCol}>
            <label
              // className='GWASUI-label'
              htmlFor='input-imputation'
            >
              Imputation Score Cutoff &nbsp;
              <InputNumber
                id='input-imputation'
                value={imputationScore}
                onChange={(e) => dispatch({
                  type: ACTIONS.UPDATE_IMPUTATION_SCORE,
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

        <Modal
          okText='Submit'
          cancelText='Back'
          open={open}
          onOk={() => handleSubmit()}
          onCancel={() => setOpen(false)}
          title={(
            <div style={{ ...flexRow, ...{ justifyContent: 'space-between' } }}>
              <div>Review Details</div>
            </div>
          )}
        >
          <Input placeholder='Enter Job Name' onChange={handleEnterJobName} />
          <div style={flexCol}>
            <div style={flexRow}>
              <div>Number of PCs</div>
              <div>{numOfPCs}</div>
            </div>
            <div style={flexRow}>
              <div>MAF Cutoff</div>
              <div>{mafThreshold}</div>
            </div>
            <div style={flexRow}>
              <div>HARE Ancestry</div>
              <div>{selectedHare?.concept_value_name}</div>
            </div>
            <div style={flexRow}>
              <div>Imputation Score Cutoff</div>
              <div>{imputationScore}</div>
            </div>
            <hr />
            <div style={flexRow}>
              <div>Cohort</div>
              <div>{selectedCohort?.cohort_name}</div>
            </div>
            <div style={flexRow}>
              <div>Outcome Phenotype</div>
              <div>{outcome?.concept_name ?? outcome?.provided_name}</div>
            </div>
            <div style={flexRow}>
              <div>Final Size</div>
              <div>{'final size'}</div>
            </div>
            <div style={flexRow}>
              <div onClick={() => console.log('cov', covariates)}>
                Covariates
              </div>
              <div style={(flexCol, { overflowY: 300 })}>
                {covariates.map((cov, key) => (
                  <div key={key}>{cov?.concept_name ?? cov.provided_name}</div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
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
  outcome: PropTypes.object,
  showModal: PropTypes.bool,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
  showModal: false,
};

export default ConfigureGWAS;
