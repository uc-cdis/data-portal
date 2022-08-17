import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, notification,
} from 'antd';
import { useMutation } from 'react-query';
import CheckOutlined from '@ant-design/icons';
import { caseControlSubmission, quantitativeSubmission } from '../wizardEndpoints/gwasWorkflowApi';

const GWASFormSubmit = ({
  sourceId,
  numOfPC,
  mafThreshold,
  imputationScore,
  selectedHare,
  selectedCaseCohort,
  selectedControlCohort,
  selectedQuantitativeCohort,
  outcome,
  workflowType,
  selectedCovariates,
  selectedDichotomousCovariates,
  gwasName,
  handleGwasNameChange,
  resetGWAS,
}) => {
  const useSubmitJob = () => {
    const openNotification = () => {
      const key = `open${Date.now()}`;
      const btn = (
        <Button type='primary' size='small' onClick={() => notification.close(key)}>
          Confirm
        </Button>
      );
      notification.open({
        message: 'Successful Submission',
        description:
          `${gwasName} job starting!`,
        icon: (<CheckOutlined />),
        placement: 'top',
        btn,
        key,
      });
    };

    const submission = useMutation(() => ((workflowType === 'caseControl')
      ? caseControlSubmission(
        sourceId,
        numOfPC,
        selectedCovariates,
        selectedDichotomousCovariates,
        selectedHare,
        mafThreshold,
        imputationScore,
        selectedCaseCohort,
        selectedControlCohort,
        gwasName,
      ) : quantitativeSubmission(
        sourceId,
        numOfPC,
        selectedCovariates,
        selectedDichotomousCovariates,
        outcome,
        selectedHare,
        mafThreshold,
        imputationScore,
        selectedQuantitativeCohort,
        gwasName,
      )), {
      onSuccess: (data) => {
        if (data?.status === 200) {
          openNotification();
          resetGWAS();
        }
      },
    });
    return submission;
  };

  const submitJob = useSubmitJob();

  return (
    <React.Fragment>
      <div className='GWASUI-flexRow GWASUI-headerColor'><h3 className='GWASUI-title'>Review Details</h3></div>
      <div className='GWASUI-flexRow GWASUI-rowItem'>
        <div className='GWASUI-flexCol GWASUI-flexHeader1'>Number of PCs</div>
        <div className='GWASUI-flexCol'>{numOfPC}</div>
        <div className='GWASUI-flexCol GWASUI-flexHeader2'>MAF Cutoff</div>
        <div className='GWASUI-flexCol'> {mafThreshold}</div>
      </div>
      <div className='GWASUI-flexRow GWASUI-rowItem'>
        <div className='GWASUI-flexCol GWASUI-flexHeader1'>HARE Ancestry</div>
        <div className='GWASUI-flexCol'>{selectedHare.concept_value_name}</div>
        <div className='GWASUI-flexCol GWASUI-flexHeader2'>Imputation Score Cutoff</div>
        <div className='GWASUI-flexCol'>{imputationScore}</div>
      </div>
      <div className='GWASUI-flexRow GWASUI-rowItem'>
        {workflowType === 'caseControl' && (
          <React.Fragment>
            <div className='GWASUI-flexCol GWASUI-flexHeader1'>Selected Case Cohort</div>
            <div className='GWASUI-flexCol'>{selectedCaseCohort?.cohort_name}</div>
            <div className='GWASUI-flexCol GWASUI-flexHeader2'>Selected Control Cohort</div>
            <div className='GWASUI-flexCol'>{selectedControlCohort?.cohort_name}</div>
          </React.Fragment>
        )}
        {workflowType === 'quantitative' && (
          <React.Fragment>
            <div className='GWASUI-flexCol GWASUI-flexHeader1'>Selected Cohort</div>
            <div className='GWASUI-flexCol'>{selectedQuantitativeCohort?.cohort_name}</div>
            <div className='GWASUI-flexCol GWASUI-flexHeader2'>Selected Outcome</div>
            <div className='GWASUI-flexCol'>{outcome?.cohort_name}</div>
          </React.Fragment>
        )}
      </div>
      <div className='GWASUI-flexRow GWASUI-rowItem'>
        <div className='GWASUI-flexCol'>Covariates</div>
        <div className='GWASUI-flexCol'>{selectedCovariates.map((cov, key) => (
          <li className='GWASUI-listItem' key={`covariate-${key}`}>{cov?.concept_name}</li>
        ))}
        </div>
      </div>
      <div className='GWASUI-flexRow GWASUI-rowItem'>
        <div className='GWASUI-flexCol'>Dichotomous Covariates</div>
        <div className='GWASUI-flexCol'>{selectedDichotomousCovariates.map((cov, key) => (
          <li className='GWASUI-listItem' key={`dich-covariate-${key}`}>{cov.provided_name}</li>
        ))}
        </div>
      </div>

      {/* <div className="GWASUI-flexRow GWASUI-rowItem">
          // TODO this is where functionality previously was. placeholder for when we add back in
            <QCShowOverlap />
        </div> */}
      <div className='GWASUI-flexRow'>
        <input
          type='text'
          className='GWASUI-nameInput'
          onChange={handleGwasNameChange}
          value={gwasName}
          placeholder='Enter a job name...'
          style={{ width: '70%', height: '90%' }}
        />
        <div className='GWASUI-submitContainer'>
          <Button
            type='primary'
            disabled={gwasName.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              submitJob.mutate();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

GWASFormSubmit.propTypes = {
  sourceId: PropTypes.number.isRequired,
  outcome: PropTypes.object,
  numOfPC: PropTypes.number.isRequired,
  mafThreshold: PropTypes.number.isRequired,
  imputationScore: PropTypes.number.isRequired,
  selectedHare: PropTypes.object.isRequired,
  selectedCaseCohort: PropTypes.object,
  selectedControlCohort: PropTypes.object,
  selectedQuantitativeCohort: PropTypes.object,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  gwasName: PropTypes.string.isRequired,
  handleGwasNameChange: PropTypes.func.isRequired,
  resetGWAS: PropTypes.func.isRequired,
  workflowType: PropTypes.string.isRequired,
};

GWASFormSubmit.defaultProps = {
  selectedControlCohort: undefined,
  selectedCaseCohort: undefined,
  selectedQuantitativeCohort: undefined,
  outcome: undefined,
};

export default GWASFormSubmit;
