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
export const WithConceptOutcome = Template.bind({});

WithConceptOutcome.args = {
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
};

export const WithDichotomousOutcome = Template.bind({});
WithDichotomousOutcome.args = {
  ...WithConceptOutcome.args,
  outcome: {
    variable_type: 'custom_dichotomous',
    concept_id: 'id',
    concept_name: 'concept name',
  },
};
