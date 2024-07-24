import React, { useState } from 'react';
import ValidState from '../../TestData/States/ValidState';
import JobInputModal from './JobInputModal';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

export default {
  title: 'Tests3/GWASApp/JobInputModal',
  component: JobInputModal,
};

const queryClient = new QueryClient();
const MockTemplate = () => {
  const [open, setOpen] = useState(false);
  const jobName = 'User Input Job Name 1234';
  const handleSubmit = () => {
    setOpen(false);
  };
  const dispatch = () => null;
  const handleEnterJobName = () => null;
  const {
    covariates,
    imputationScore,
    mafThreshold,
    numOfPCs,
    selectedHare,
    finalPopulationSizes,
    outcome,
    selectedStudyPopulationCohort,
  } = ValidState;

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className='GWASApp'
        style={{ background: '#f5f5f5', padding: '40px', textAlign: 'center' }}
      >
        <h1>JobInputModal</h1>
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
          selectedCohort={selectedStudyPopulationCohort}
          outcome={outcome}
          finalPopulationSizes={finalPopulationSizes}
          covariates={covariates}
        />
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          Open Modal
        </button>
      </div>
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
