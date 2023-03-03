import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import PhenotypeHistogram from './PhenotypeHistogram';
import { SourceContextProvider } from '../../../Utils/Source';

export default {
  title: 'Tests3/GWASApp/PhenotypeHistogram',
  component: PhenotypeHistogram,
};

const mockedQueryClient = new QueryClient();

const Template = (args) => (
  <QueryClientProvider client={mockedQueryClient}>
    <SourceContextProvider>
      <PhenotypeHistogram {...args} />
    </SourceContextProvider>
  </QueryClientProvider>
);

const selectedStudyPopulationCohort = {
  cohort_definition_id: 25,
  cohort_name: 'Mock population ',
  size: 4000,
};

const currentSelection = {
  concept_id: 2000006886,
  concept_name: 'Attribute1',
  variable_type: 'concept',
};

const selectedCovariates = [
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
    concept_id: 2000006887,
    concept_name: 'concept name',
  },
];

export const SuccessCase = Template.bind({});
SuccessCase.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  selectedStudyPopulationCohort: selectedStudyPopulationCohort,
  selectedCovariates: selectedCovariates,
  outcome: null,
  selectedContinuousItem: currentSelection,
};
SuccessCase.parameters = {
  // msw mocking:
  msw: {
    handlers: [
      rest.post(
        //histogram/by-source-id/${sourceId}/by-cohort-definition-id/${cohortId}/by-histogram-concept-id/${currentSelection.concept_id}`;
        'http://:cohortmiddlewarepath/cohort-middleware/histogram/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinitionId/by-histogram-concept-id/:conceptId',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinitionId } = req.params;
          return res(
            ctx.delay(1100),
            ctx.json({
              bins: [
                { start: 1.4564567, end: 10.45642, nr_persons: 800 },
                { start: 10.45642, end: 20, nr_persons: 1200 },
                { start: 20, end: 30, nr_persons: 1300 },
                { start: 30, end: 40, nr_persons: 1400 },
                { start: 40, end: 50, nr_persons: 1500 },
                { start: 50, end: 60, nr_persons: 1400 },
                { start: 60, end: 70, nr_persons: 1350 },
                { start: 70, end: 80, nr_persons: 1100 },
                { start: 8000, end: 90, nr_persons: 150 },
              ],
            })
          );
        }
      ),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  selectedStudyPopulationCohort: selectedStudyPopulationCohort,
  selectedCovariates: selectedCovariates,
  outcome: null,
  selectedContinuousItem: currentSelection,
};
// mock endpoint failure:
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/histogram/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinitionId/by-histogram-concept-id/:conceptId',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
