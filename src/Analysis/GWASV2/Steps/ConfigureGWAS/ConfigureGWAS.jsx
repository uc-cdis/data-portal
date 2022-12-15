import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { InputNumber, Modal, Input } from 'antd';
import SelectHareDropDown from '../../Components/SelectHare/SelectHareDropDown';
import ACTIONS from '../../Shared/StateManagement/Actions';
import DismissibleMessage from '../../Components/DismissibleMessage/DismissibleMessage';
import { jobSubmission } from '../../Shared/gwasWorkflowApi';
import { useSourceContext } from '../../Shared/Source';
import '../../GWASV2.css';
import './ConfigureGWAS.css';

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
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity

  const { flexCol, flexRow } = twSudo;

  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState('');

  const [showError, setShowError] = useState(false);

  const [jobName, setJobName] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleEnterJobName = (e) => {
    setJobName(e.target.value);
  };

  useEffect(() => {
    if (showModal === true) {
      setOpen(true);
    }
  }, [showModal]);

  const submitJob = useMutation(
    () => jobSubmission(
      sourceId,
      numOfPCs,
      covariates,
      outcome,
      selectedHare,
      mafThreshold,
      imputationScore,
      selectedCohort,
      jobName,
    ),
    {
      onSuccess: (data) => {
        if (data?.status === 200) {
          data.text().then((success) => {
            setShowSuccess(true);
            setSuccessText(`GWAS job id: ${success}`);
          });
        } else {
          data.text().then((error) => {
            setErrorText(
              `GWAS job failed with error: ${JSON.stringify(error)}`,
            );
            setShowError(true);
          });
        }
      },
    },
  );

  const handleSubmit = () => {
    setOpen(false);
    submitJob.mutate();
  };

  return (
    <div className='configure-gwas'>
      {showSuccess && (
        <div className='configure-gwas_success'>
          <DismissibleMessage
            title={`Congratulations on your submission for ${jobName}`}
            description={`${successText}`}
          />
          <h3>DO YOU WANT TO</h3>
          <div className='GWASUI-row'>
            <div className='GWASUI-column'>
              <a href='./GWASResults'>
                <button type='button'>See Status</button>
              </a>
            </div>
            <div className='GWASUI-column'>
              <button
                type='button'
                onClick={() => {
                  window.location.reload();
                }}
              >
                Submit New Workflow
              </button>
            </div>
            <div className='GWASUI-column'>
              <button
                type='button'
                onClick={() => {
                  setShowSuccess(false);
                  dispatch({
                    type: ACTIONS.SET_CURRENT_STEP,
                    payload: 3,
                  });
                }}
              >
                Submit Similar (Stay Here)
              </button>
            </div>
          </div>
        </div>
      )}
      {showError && (
        <DismissibleMessage
          title={'Job submission failed!'}
          description={`${errorText}`}
          messageType={'warning'}
        />
      )}
      <div className='configure-gwas_container'>
        <div className='GWASUI-row'>
          <div className='GWASUI-column'>
            <label htmlFor='input-numOfPC'>Number of PCs to use</label>
            <InputNumber
              id='input-numOfPC'
              value={numOfPCs}
              min={1}
              max={10}
              onChange={(e) => dispatch({ type: ACTIONS.UPDATE_NUM_PCS, payload: Number(e) })}
            />
          </div>
          <div className='GWASUI-column'>
            <label htmlFor='input-maf'>MAF Cutoff &nbsp;</label>
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
          </div>
        </div>

        <div className='GWASUI-row'>
          <div className='GWASUI-column'>
            <label htmlFor='input-selectHareDropDown'>HARE Ancestry</label>
            <SelectHareDropDown
              id='input-selectHareDropDown'
              selectedCohort={selectedCohort}
              covariates={covariates}
              outcome={outcome}
              handleHareChange={dispatch}
            />
          </div>

          <div className='GWASUI-column'>
            <label htmlFor='input-imputation'>
              Imputation Score Cutoff &nbsp;{' '}
            </label>
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
          </div>
        </div>

        <Modal
          okText='Submit'
          cancelText='Back'
          open={open}
          okButtonProps={{ disabled: jobName === '' }}
          onOk={() => handleSubmit()}
          onCancel={() => {
            setOpen(false);
            dispatch({
              type: ACTIONS.SET_CURRENT_STEP,
              payload: 3,
            });
          }}
          title={(
            <div style={{ ...flexRow, ...{ justifyContent: 'space-between' } }}>
              <div>Review Details</div>
            </div>
          )}
        >
          <Input
            className='gwas-job-name'
            placeholder='Enter Job Name'
            onChange={handleEnterJobName}
          />
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
              <div>Covariates</div>
              <div>
                {covariates.map((covariate, key) => (
                  <div key={key}>
                    {covariate?.concept_name ?? covariate.provided_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

ConfigureGWAS.propTypes = {
  dispatch: PropTypes.func.isRequired,
  numOfPCs: PropTypes.number,
  mafThreshold: PropTypes.number,
  imputationScore: PropTypes.number,
  covariates: PropTypes.array.isRequired,
  selectedCohort: PropTypes.object.isRequired,
  selectedHare: PropTypes.object.isRequired,
  outcome: PropTypes.object.isRequired,
  showModal: PropTypes.bool,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
  showModal: false,
};

export default ConfigureGWAS;
