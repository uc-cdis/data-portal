import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import ACTIONS from '../../Utils/StateManagement/Actions';
import { useQuery } from 'react-query';
import {
  fetchMonthlyWorkflowLimitInfo,
  workflowLimitsInvalidDataMessage,
  workflowLimitsLoadingErrorMessage,
  workflowLimitInfoIsValid,
} from '../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';
import { LoadingErrorMessage } from '../../../SharedUtils/LoadingErrorMessage/LoadingErrorMessage';
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
  const { data, status } = useQuery(
    ['monthly-workflow-limit-job-input-modal'],
    fetchMonthlyWorkflowLimitInfo
  );
  const IsButtonDisabled =
    jobName === '' ||
    status === 'loading' ||
    status === 'error' ||
    !workflowLimitInfoIsValid(data);

  return (
    <Modal
      okText='Submit'
      cancelText='Back'
      open={open}
      okButtonProps={{
        disabled: IsButtonDisabled,
        loading: status === 'loading' ? 'loading' : false,
      }}
      onOk={() => handleSubmit()}
      onCancel={() => {
        setOpen(false);
        dispatch({
          type: ACTIONS.SET_CURRENT_STEP,
          payload: 3,
        });
      }}
      title={
        <div className='flex-row'>
          <div>Review Details</div>
        </div>
      }
    >
      <Input
        className='gwas-job-name'
        placeholder='Enter Job Name'
        onChange={handleEnterJobName}
      />
      <div className='flex-col'>
        <div className='flex-row'>
          <div>Number of PCs</div>
          <div id='modal-num-of-pcs'>{numOfPCs}</div>
        </div>
        <div className='flex-row'>
          <div>MAF Cutoff</div>
          <div id='modal-maf-threshold'>{mafThreshold}</div>
        </div>
        <div className='flex-row'>
          <div>HARE Ancestry</div>
          <div id='modal-hare-ancestry'>{selectedHare?.concept_value_name}</div>
        </div>
        <div className='flex-row'>
          <div>Imputation Score Cutoff</div>
          <div id='modal-imputation-score'>{imputationScore}</div>
        </div>
        <hr />
        <div className='flex-row'>
          <div>Cohort</div>
          <div id='modal-cohort'>{selectedCohort?.cohort_name}</div>
        </div>
        <div className='flex-row'>
          <div>Outcome Phenotype</div>
          <div id='modal-outcome'>
            {outcome?.concept_name ?? outcome?.provided_name}
          </div>
        </div>
        {finalPopulationSizes.map((item, key) => (
          <div id='modal-population-size' key={key} className='flex-row'>
            <div>{item.population} Size</div>
            <div>{item.size}</div>
          </div>
        ))}
        <div className='flex-row'>
          <div>Covariates</div>
          <div id='modal-covariates'>
            {covariates.map((covariate, key) => (
              <div key={key}>
                {covariate?.concept_name ?? covariate.provided_name}
              </div>
            ))}
          </div>
        </div>
        {status === 'error' && <div>ERROR</div>}
        {status === 'success' && !workflowLimitInfoIsValid(data) && (
          <div>Invalid Data</div>
        )}
        {status === 'success' && workflowLimitInfoIsValid(data) && (
          <div>Valid Data</div>
        )}
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
