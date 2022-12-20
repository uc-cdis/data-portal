import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import ACTIONS from '../../Utils/StateManagement/Actions';
import './JobInputModal.css';

const JobInputModal = ({
  open,
  jobName,
  handleSubmit,
  setOpen,
  dispatch,
  handleEnterJobName,
  numOfPCs,
  mafThreshold,
  selectedHare,
  imputationScore,
  selectedCohort,
  outcome,
  finalPopulationSizes,
  covariates,
}) => {
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

  const { flexCol, flexRow } = twSudo;
  return (
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
        {finalPopulationSizes.map((item, key) => (
          <div key={key} style={flexRow}>
            <div>{item.population} Size</div>
            <div>{item.size}</div>
          </div>
        ))}
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
  );
};

JobInputModal.propTypes = {
  open: PropTypes.bool.isRequired,
  jobName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleEnterJobName: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  numOfPCs: PropTypes.number.isRequired,
  mafThreshold: PropTypes.number.isRequired,
  imputationScore: PropTypes.number.isRequired,
  covariates: PropTypes.array.isRequired,
  selectedCohort: PropTypes.object.isRequired,
  selectedHare: PropTypes.object.isRequired,
  outcome: PropTypes.object.isRequired,
  finalPopulationSizes: PropTypes.array.isRequired,
};

export default JobInputModal;
