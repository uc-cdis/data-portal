import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTable from './AttritionTable';

export default {
  title: 'Tests2/GWASUI/AttritionTable',
  component: AttritionTable,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedOutome, setSelectedOutcome] = useState({ variable_type: 'custom_dichotomous', cohort_ids: [1, 2], provided_name: 'test outcome', uuid: '1234' })
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([
    { variable_type: 'custom_dichotomous', cohort_ids: [1, 2], provided_name: 'test1' , uuid: '12345'},
    { variable_type: 'custom_dichotomous', cohort_ids: [3, 4], provided_name: 'test2' , uuid: '123456'}]);
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

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <AttritionTable
        // quantitative:
        sourceId={1}
        cohortDefinitionId={123}
        outcome={selectedOutome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        workflowType={'quantitative'}  // let's remove this?
      />
    <AttritionTable
        // case-control:
        sourceId={1}
        cohortDefinitionId={123}
        otherCohortDefinitionId={456}
        // no outcome
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        // + use   fetchConceptStatsByHareForCaseControl

        workflowType={'quantitative'} // let's remove this?
      />

    </QueryClientProvider>
  );
};

let rowCount = 0;

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid', (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params;
        const { cohortdefinition } = req.params;
        console.log(cohortmiddlewarepath);
        console.log(cohortdefinition);
        rowCount++;
        return res(
          ctx.delay(600*rowCount),
          ctx.json({
            concept_breakdown: [
              {
                concept_value: 'ASN',
                concept_value_as_concept_id: 2000007029,
                concept_value_name: 'non-Hispanic Asian',
                persons_in_cohort_with_value: 40178 * (10-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'EUR',
                concept_value_as_concept_id: 2000007031,
                concept_value_name: 'non-Hispanic White',
                persons_in_cohort_with_value: 39648 * (10-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'AFR',
                concept_value_as_concept_id: 2000007030,
                concept_value_name: 'non-Hispanic Black',
                persons_in_cohort_with_value: 40107 * (10-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'HIS',
                concept_value_as_concept_id: 2000007028,
                concept_value_name: 'Hispanic',
                persons_in_cohort_with_value: 40038 * (10-rowCount), // just to mock/generate different numbers for different cohorts,
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
      rest.post('', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
