import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import GWASFormSubmit from './GWASFormSubmit';

export default {
  title: 'Tests2/GWASUI/GWASFormSubmit',
  component: GWASFormSubmit,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([
    { variable_type: 'custom_dichotomous', cohort_ids: [1, 2], provided_name: 'test1' },
    { variable_type: 'custom_dichotomous', cohort_ids: [3, 4], provided_name: 'test2' }]);
  const [selectedCovariates, setSelectedCovariates] = useState([
    {
      concept_id: 2000006886, prefixed_concept_id: 'ID_2000006886', concept_name: 'Attribute1', concept_code: '', concept_type: 'MVP Continuous',
    },
    {
      concept_id: 2000006885, prefixed_concept_id: 'ID_2000006885', concept_name: 'Attribute10', concept_code: '', concept_type: 'MVP Continuous',
    },
    {
      concept_id: 2000000708, prefixed_concept_id: 'ID_2000000708', concept_name: 'Attribute11', concept_code: '', concept_type: 'MVP Continuous',
    }]);
  const [selectedHare, setSelectedHare] = useState({
    concept_value: 'AFR',
    concept_value_as_concept_id: 2000007030,
    concept_value_name: 'non-Hispanic Black',
    persons_in_cohort_with_value: 37240,
  });
  const [gwasName, setGwasName] = useState('');
  const [selectedCaseCohort, setSelectedCaseCohort] = useState({
    cohort_definition_id: 123,
    cohort_name: 'Mock cohort 123',
    size: 123123,
  });
  const [selectedControlCohort, setSelectedControlCohort] = useState({
    cohort_definition_id: 456,
    cohort_name: 'Mock cohort 456 with loooong name to test how a long name is rendered',
    size: 456456,
  });

  const handleGwasNameChange = (e) => {
    setGwasName(e.target.value);
  };

  const resetGWAS = () => {
    console.log('resetGWAS called');
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <GWASFormSubmit
        sourceId={1}
        numOfPC={3}
        mafThreshold={0.5}
        imputationScore={2.5}
        selectedHare={selectedHare}
        selectedCaseCohort={selectedCaseCohort}
        selectedControlCohort={selectedControlCohort}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        gwasName={gwasName}
        handleGwasNameChange={handleGwasNameChange}
        resetCaseControl={resetGWAS}
      />
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post('http://:serverpath/ga4gh/wes/v2/submit', (req, res, ctx) => {
        const { serverpath } = req.params;
        console.log(serverpath);
        return res(
          ctx.delay(1100),
          ctx.json({
            ok: 'test',
          }),
        );
      }),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post('http://:serverpath/ga4gh/wes/v2/submit', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
