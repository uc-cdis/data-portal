import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTableWrapper from './AttritionTableWrapper';
import '../../GWASV2.css';

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
export const WithOutcome = Template.bind({});

WithOutcome.args = {
  sourceId: 1,
  outcome: {
    variable_type: 'concept',
    concept_id: 'id',
    concept_name: 'concept name',
  },
  newCovariateSubset: [
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
  otherSelectedCohort: {
    cohort_definition_id: 456,
    cohort_name: 'cohort name def',
  },
  selectedDichotomousCovariates: [
    {
      variable_type: 'custom_dichotomous',
      cohort_ids: [1, 2],
      provided_name: 'dichotomous test1',
      uuid: '12345',
    },
    {
      variable_type: 'custom_dichotomous',
      cohort_ids: [3, 4],
      provided_name: 'dichotomous test2',
      uuid: '123456',
    },
  ],
  selectedCovariates: [
    {
      concept_id: 2000006886,
      prefixed_concept_id: 'ID_2000006886',
      concept_name: 'Attribute1',
      concept_code: '',
      concept_type: 'MVP Continuous',
    },
    {
      concept_id: 2000006885,
      prefixed_concept_id: 'ID_2000006885',
      concept_name: 'Attribute10',
      concept_code: '',
      concept_type: 'MVP Continuous',
    },
    {
      concept_id: 2000000708,
      prefixed_concept_id: 'ID_2000000708',
      concept_name: 'Attribute11',
      concept_code: '',
      concept_type: 'MVP Continuous',
    },
  ],
};

export const WithNoOutcome = Template.bind({});
WithNoOutcome.args = { ...WithOutcome.args, outcome: {} };
