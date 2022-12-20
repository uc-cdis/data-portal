import React, { useState } from 'react';
import JobInputModal from './JobInputModal';

export default {
  title: 'Tests3/GWASV2/JobInputModal',
  component: JobInputModal,
};

const MockTemplate = () => {
  const [open, setOpen] = useState(false);
  const jobName = 'User Input Job Name 1234';
  const handleSubmit = () => {
    setOpen(false);
  };
  const dispatch = () => null;
  const handleEnterJobName = () => null;
  const covariates = [
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute81',
    },
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute82',
    },
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute83',
    },
  ];
  const selectedCohort = {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute83',
  };
  const imputationScore = 0.3;
  const mafThreshold = 0.01;
  const numOfPCs = 3;
  const selectedHare = {
    concept_value: '',
  };
  const finalPopulationSizes = [
    { population: 'Control', size: 90 },
    { population: 'Case', size: 95 },
    { population: 'Total', size: 90 + 95 },
  ];
  const outcome = {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute83',
  };

  return (
    <div
      className='GWASV2'
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
        selectedCohort={selectedCohort}
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
  );
};

export const MockedSuccess = MockTemplate.bind({});
