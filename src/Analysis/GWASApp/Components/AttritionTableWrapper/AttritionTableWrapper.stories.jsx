import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTableWrapper from './AttritionTableWrapper';
import { SourceContextProvider } from '../../Utils/Source';
import {
  generateEulerTestData,
  generateHistogramTestData,
} from '../../TestData/generateDiagramTestData';
import '../../GWASApp.css';

let rowCount = 0;
export default {
  title: 'Tests3/GWASApp/AttritionTable/AttritionTableWrapper',
  component: AttritionTableWrapper,
};

const mockedQueryClient = new QueryClient();
const Template = (args) => (
  <QueryClientProvider client={mockedQueryClient}>
    <SourceContextProvider>
      <AttritionTableWrapper {...args} />
    </SourceContextProvider>
  </QueryClientProvider>
);
export const WithConceptOutcome = Template.bind({});

WithConceptOutcome.args = {
  sourceId: 1,
  outcome: {
    size: 123,
    variable_type: 'concept',
    concept_id: 'id',
    concept_name: 'concept name',
  },
  covariates: [
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_sizes: [9999912, 9999932],
      cohort_names: ['name1', 'name2'],
      cohort_ids: [12, 32],
    },
    {
      variable_type: 'custom_dichotomous',
      cohort_sizes: [9999912, 9999932],
      cohort_names: ['name1', 'name2'],
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
    size: 213,
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
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/histogram/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinitionId',
        (req, res, ctx) => {
          return res(
            ctx.delay(2000),
            ctx.json({
              bins: generateHistogramTestData(),
            })
          );
        }
      ),
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/cohort-stats/check-overlap/by-source-id/:sourceid/by-cohort-definition-ids/:cohortdefinitionA/:cohortdefinitionB',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinitionA } = req.params;
          const { cohortdefinitionB } = req.params;
          return res(ctx.delay(1100), ctx.json(generateEulerTestData()));
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
    cohort_sizes: [123, 293],
    cohort_names: ['VZ 293 Participants', 'test1234 - team1 - test june'],
    cohort_ids: [468, 453],
    provided_name: 'dichotomous test1',
  },
};
WithDichotomousOutcome.parameters = { ...WithConceptOutcome.parameters };
