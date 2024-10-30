import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import DismissibleMessage from '../../../SharedUtils/DismissibleMessage/DismissibleMessage';
import { jobSubmission } from '../../Utils/gwasWorkflowApi';
import { useSourceContext } from '../../Utils/Source';
import Congratulations from '../../Components/Congratulations/Congratulations';
import JobInputModal from '../../Components/JobInputModal/JobInputModal';
import SelectConfiguration from '../../Components/SelectConfiguration/SelectConfiguration';
import ACTIONS from '../../Utils/StateManagement/Actions';
import {
  MESSAGES,
  checkFinalPopulationSizes,
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
  selectedTeamProject,
}) => {
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity
  const covariatesWithoutCohortNamesAndCohortSizes = covariates.map(
    ({ cohort_names, cohort_sizes, ...allOtherKeyValuePairs }) => allOtherKeyValuePairs,
  );
  const outcomeWithoutCohortNamesAndCohortSizes = outcome.map(
    ({ cohort_names, cohort_sizes, ...allOtherKeyValuePairs }) => allOtherKeyValuePairs,
  );
  console.log('outcome',outcome);
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

  useEffect(() => {
    if (checkFinalPopulationSizeZero(finalPopulationSizes)) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: MESSAGES.ZERO_SIZE_WARNING,
      });
    } else if (
      finalPopulationSizes.length === 1
      && checkFinalPopulationSizes(finalPopulationSizes)
    ) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: MESSAGES.SMALL_COHORT_CAUTION,
      });
    } else if (
      finalPopulationSizes.length > 1
      && checkFinalPopulationSizes(finalPopulationSizes)
    ) {
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
      covariatesDataWithoutCohortNamesAndCohortSizes,
      outcomeWithoutCohortNamesAndCohortSizes,
      selectedHare,
      mafThreshold,
      imputationScore,
      selectedCohort,
      jobName,
      selectedTeamProject,
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
  selectedTeamProject: PropTypes.string.isRequired,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
  showModal: false,
};

export default ConfigureGWAS;
