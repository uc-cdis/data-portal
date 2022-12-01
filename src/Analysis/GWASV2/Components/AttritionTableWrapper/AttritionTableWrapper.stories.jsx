import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTableWrapper from './AttritionTableWrapper';
import '../../GWASV2.css';

let rowCount = 0;
export default {
  title: 'Tests3/GWASV2/AttritionTable/AttritionTableWrapper',
  component: AttritionTableWrapper,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const Template = (args) => (
  <QueryClientProvider client={mockedQueryClient}>
    <AttritionTableWrapper {...args} />
  </QueryClientProvider>
);
export const WithConceptOutcome = Template.bind({});

WithConceptOutcome.args = {
  sourceId: 1,
  outcome: {
    variable_type: 'concept',
    concept_id: 'id',
    concept_name: 'concept name',
  },
  covariates: [
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_ids: [12, 32],
    },
    {
      variable_type: 'custom_dichotomous',
      cohort_ids: [1, 2],
      provided_name: 'dichotomous test1',
    },
    {
      variable_type: 'concept',
      concept_id: 'id',
      concept_name: 'concept name',
    },
    {
      concept_id: 2000006886,
      concept_name: 'Attribute1',
      variable_type: 'concept',
    },
  ],
  selectedCohort: {
    cohort_definition_id: 123,
    cohort_name: 'cohort name abc',
  },
};
WithConceptOutcome.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinition } = req.params;
          rowCount++;
          if (rowCount == 12) {
            // simulate empty response scenario:
            return res(
              ctx.delay(200 * rowCount),
              ctx.json({
                concept_breakdown: null,
              })
            );
          }
          return res(
            ctx.delay(200 * rowCount),
            ctx.json({
              concept_breakdown: [
                {
                  concept_value: 'ASN',
                  concept_value_as_concept_id: 2000007029,
                  concept_value_name: 'non-Hispanic Asian',
                  persons_in_cohort_with_value: 40178 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'EUR',
                  concept_value_as_concept_id: 2000007031,
                  concept_value_name: 'non-Hispanic White',
                  persons_in_cohort_with_value: 39648 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'AFR',
                  concept_value_as_concept_id: 2000007030,
                  concept_value_name: 'non-Hispanic Black',
                  persons_in_cohort_with_value: 40107 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'HIS',
                  concept_value_as_concept_id: 2000007028,
                  concept_value_name: 'Hispanic',
                  persons_in_cohort_with_value: 40038 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
              ],
            })
          );
        }
      ),
    ],
  },
};

export const WithDichotomousOutcome = Template.bind({});
WithDichotomousOutcome.args = {
  ...WithConceptOutcome.args,
  outcome: {
    variable_type: 'custom_dichotomous',
    cohort_ids: [1, 2],
    provided_name: 'dichotomous test1',
  },
};
WithDichotomousOutcome.parameters = { ...WithConceptOutcome.parameters };
