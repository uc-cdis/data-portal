import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import WorkflowParameters from './WorkflowParameters';

export default {
  title: 'Tests2/GWASUI/WorkflowParameters',
  component: WorkflowParameters,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([
    { variable_type: 'custom_dichotomous', cohort_ids: [10, 20], provided_name: 'test1' },
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
  const [selectedHare, setSelectedHare] = useState({});
  const [numOfPC, setNumOfPC] = useState(3);
  const [imputationScore, setImputationScore] = useState(0.3);
  const [mafThreshold, setMafThreshold] = useState(0.01);
  const [gwasName, setGwasName] = useState('');

  const handleHareChange = (cd) => {
    setSelectedHare(cd);
  };

  const handleNumOfPC = (num) => {
    console.log(num);
    setNumOfPC(num);
  };

  const handleImputation = (imp) => {
    setImputationScore(imp);
  };

  const handleMaf = (imp) => {
    setMafThreshold(imp);
  };

  const handleCovariateDelete = (remainingCovariates) => {
    const covariateMapping = remainingCovariates.map((conceptName) => selectedCovariates.find((concept) => concept.concept_name === conceptName));
    setSelectedCovariates(covariateMapping);
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <WorkflowParameters
        caseCohortDefinitionId={1}
        controlCohortDefinitionId={2}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        sourceId={1}
        workflowType={'caseControl'}
        selectedHare={selectedHare}
        handleHareChange={handleHareChange}
        handleNumOfPC={handleNumOfPC}
        handleImputation={handleImputation}
        handleMaf={handleMaf}
        handleCovariateDelete={handleCovariateDelete}
        numOfPC={numOfPC}
        mafThreshold={mafThreshold}
        imputationScore={imputationScore}
      />
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid', (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params;
        const { cohortdefinition } = req.params;
        console.log(cohortmiddlewarepath);
        console.log(cohortdefinition);
        return res(
          ctx.delay(1100),
          ctx.json({
            concept_breakdown: [
              {
                concept_value: 'OTH',
                concept_value_as_concept_id: 2000007032,
                concept_value_name: 'Other',
                persons_in_cohort_with_value: 40029 * cohortdefinition, // just to mock/generate different numbers for different cohorts
              },
              {
                concept_value: 'ASN',
                concept_value_as_concept_id: 2000007029,
                concept_value_name: 'non-Hispanic Asian',
                persons_in_cohort_with_value: 40178 * cohortdefinition, // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'EUR',
                concept_value_as_concept_id: 2000007031,
                concept_value_name: 'non-Hispanic White',
                persons_in_cohort_with_value: 39648 * cohortdefinition, // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'AFR',
                concept_value_as_concept_id: 2000007030,
                concept_value_name: 'non-Hispanic Black',
                persons_in_cohort_with_value: 40107 * cohortdefinition, // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'HIS',
                concept_value_as_concept_id: 2000007028,
                concept_value_name: 'Hispanic',
                persons_in_cohort_with_value: 40038 * cohortdefinition, // just to mock/generate different numbers for different cohorts,
              },
            ],
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
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
