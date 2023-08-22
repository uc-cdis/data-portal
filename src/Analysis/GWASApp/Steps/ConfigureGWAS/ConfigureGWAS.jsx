import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import DismissibleMessage from '../../Components/DismissibleMessage/DismissibleMessage';
import { jobSubmission } from '../../Utils/gwasWorkflowApi';
import { useSourceContext } from '../../Utils/Source';
import Congratulations from '../../Components/Congratulations/Congratulations';
import JobInputModal from '../../Components/JobInputModal/JobInputModal';
import SelectConfiguration from '../../Components/SelectConfiguration/SelectConfiguration';
import ACTIONS from '../../Utils/StateManagement/Actions';
import {
  minimumRecommendedCohortSize,
  MESSAGES,
  checkFinalPopulationSizeZero,
} from '../../Utils/constants';
import '../../GWASApp.css';

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
  finalPopulationSizes,
}) => {
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity

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

  function checkFinalPopulationSizes() {
    let hasSizeIssue = false;
    finalPopulationSizes.forEach((obj) => {
      if (obj?.size < minimumRecommendedCohortSize) {
        hasSizeIssue = true;
      }
    });
    return hasSizeIssue;
  }

  useEffect(() => {
    if (checkFinalPopulationSizeZero(finalPopulationSizes)) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: MESSAGES.ZERO_SIZE_WARNING,
      });
    } else if (
      finalPopulationSizes.length === 1
      && checkFinalPopulationSizes()
    ) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: MESSAGES.SMALL_COHORT_CAUTION,
      });
    } else if (finalPopulationSizes.length > 1 && checkFinalPopulationSizes()) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: MESSAGES.SMALL_CONTROL_OR_CASE_CAUTION,
      });
    }
  }, [finalPopulationSizes]);

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
    <div data-tour='configure-gwas' className='configure-gwas'>
      {showSuccess && (
        <Congratulations
          dispatch={dispatch}
          setShowSuccess={setShowSuccess}
          successText={successText}
          jobName={jobName}
        />
      )}
      {showError && (
        <DismissibleMessage
          title={'Job submission failed!'}
          description={`${errorText}`}
          messageType={'warning'}
        />
      )}
      {submitJob.isLoading && (
        <div className='GWASUI-spinnerContainer set-height'>
          <Spin />
        </div>
      )}
      <div className='configure-gwas_container'>
        <SelectConfiguration
          numOfPCs={numOfPCs}
          mafThreshold={mafThreshold}
          selectedCohort={selectedCohort}
          covariates={covariates}
          outcome={outcome}
          dispatch={dispatch}
          imputationScore={imputationScore}
        />
        <JobInputModal
          open={open}
          jobName={jobName}
          handleSubmit={handleSubmit}
          setOpen={setOpen}
          dispatch={dispatch}
          handleEnterJobName={handleEnterJobName}
          numOfPCs={numOfPCs}
          mafThreshold={mafThreshold}
          selectedHare={selectedHare}
          imputationScore={imputationScore}
          selectedCohort={selectedCohort}
          outcome={outcome}
          finalPopulationSizes={finalPopulationSizes}
          covariates={covariates}
        />
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
  finalPopulationSizes: PropTypes.array.isRequired,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
  showModal: false,
};

export default ConfigureGWAS;
