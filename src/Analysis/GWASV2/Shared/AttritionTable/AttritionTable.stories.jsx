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
  //for later:
  //const [selectedOutome, setSelectedOutcome] = useState({ variable_type: 'custom_dichotomous', cohort_ids: [1, 2], provided_name: 'test outcome', uuid: '1234' })
  const [selectedOutome, setSelectedOutcome] = useState({ concept_id: 2000006886, concept_name: 'Attribute1', concept_code: '', concept_type: 'MVP Continuous', })
  const [selectedCohort, setSelectedCohort] = useState({cohort_definition_id: 123, cohort_name: 'cohort name abc'});
  const [otherSelectedCohort, otherSetSelectedCohort] = useState({cohort_definition_id: 456, cohort_name: 'cohort name def'});
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([
    { variable_type: 'custom_dichotomous', cohort_ids: [1, 2], provided_name: 'dichotomous test1' , uuid: '12345'},
    { variable_type: 'custom_dichotomous', cohort_ids: [3, 4], provided_name: 'dichotomous test2' , uuid: '123456'}]);
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
        selectedCohort={selectedCohort}
        outcome={selectedOutome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={'Quantitative Attrition Table'}
      />
    <AttritionTable
        // case-control:
        sourceId={1}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        // no outcome
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={'Case Cohort Attrition Table (1 of 2)'}

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
        if (rowCount == 12) {
          // simulate empty response scenario:
          return res(
            ctx.delay(200*rowCount),
            ctx.json({
              concept_breakdown: null})
          );
        }
        return res(
          ctx.delay(200*rowCount),
          ctx.json({
            concept_breakdown: [
              {
                concept_value: 'ASN',
                concept_value_as_concept_id: 2000007029,
                concept_value_name: 'non-Hispanic Asian',
                persons_in_cohort_with_value: 40178 * (20-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'EUR',
                concept_value_as_concept_id: 2000007031,
                concept_value_name: 'non-Hispanic White',
                persons_in_cohort_with_value: 39648 * (20-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'AFR',
                concept_value_as_concept_id: 2000007030,
                concept_value_name: 'non-Hispanic Black',
                persons_in_cohort_with_value: 40107 * (20-rowCount), // just to mock/generate different numbers for different cohorts,
              },
              {
                concept_value: 'HIS',
                concept_value_as_concept_id: 2000007028,
                concept_value_name: 'Hispanic',
                persons_in_cohort_with_value: 40038 * (20-rowCount), // just to mock/generate different numbers for different cohorts,
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
