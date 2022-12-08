import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTable from './AttritionTable';
import { SourceContextProvider } from '../../../Shared/Source';
import '../../../GWASV2.css';

export default {
  title: 'Tests3/GWASV2/AttritionTable/AttritionTable',
  component: AttritionTable,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const selectedCohort = {
    cohort_definition_id: 123,
    cohort_name: 'cohort name abc',
  };

  const covariatesLong = [
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
    {
      concept_id: 2000006880,
      concept_name: 'Attribute0',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006881,
      concept_name: 'Attribute1',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006882,
      concept_name: 'Attribute2',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006883,
      concept_name: 'Attribute3',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006884,
      concept_name: 'Attribute4',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006885,
      concept_name: 'Attribute5',
      variable_type: 'concept',
    },
    {
      concept_id: 2000006886,
      concept_name: 'Attribute6',
      variable_type: 'concept',
    },

    {
      concept_id: 2000006887,
      concept_name: 'Attribute7',
      variable_type: 'concept',
    },

    {
      concept_id: 2000006888,
      concept_name: 'Attribute8',
      variable_type: 'concept',
    },

    {
      concept_id: 2000006889,
      concept_name: 'Attribute9',
      variable_type: 'concept',
    },

    {
      concept_id: 20000068810,
      concept_name: 'Attribute10',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068811,
      concept_name: 'Attribute11',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068812,
      concept_name: 'Attribute12',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068813,
      concept_name: 'Attribute13',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068814,
      concept_name: 'Attribute14',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068815,
      concept_name: 'Attribute15',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068816,
      concept_name: 'Attribute16',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068817,
      concept_name: 'Attribute17',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068818,
      concept_name: 'Attribute18',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068819,
      concept_name: 'Attribute19',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068820,
      concept_name: 'Attribute20',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068821,
      concept_name: 'Attribute21',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068822,
      concept_name: 'Attribute22',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068823,
      concept_name: 'Attribute23',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068824,
      concept_name: 'Attribute24',
      variable_type: 'concept',
    },
    {
      concept_id: 20000068825,
      concept_name: 'Attribute25',
      variable_type: 'concept',
    },
  ];
  const outcome = {
    variable_type: 'custom_dichotomous',
    cohort_ids: [1, 2],
    provided_name: 'dichotomous test1',
  };
  const covariatesShort = [
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_ids: [12, 32],
    },
  ];

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <AttritionTable
          selectedCohort={selectedCohort}
          outcome={outcome}
          covariates={covariatesLong}
          tableType={'Case Cohort'}
        />
        <AttritionTable
          selectedCohort={selectedCohort}
          outcome={outcome}
          covariates={covariatesShort}
          tableType={'Control Cohort'}
        />
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

let rowCount = 0;

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
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

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post('', (req, res, ctx) => res(ctx.delay(800), ctx.status(403))),
    ],
  },
};
