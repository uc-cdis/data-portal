import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import CustomDichotomousCovariates from './CustomDichotomousCovariates';
import { SourceContextProvider } from '../../Shared/Source';

export default {
  title: 'Tests3/GWASV2/CustomDichotomousCovariates',
  component: CustomDichotomousCovariates,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Template = (args) =>
<QueryClientProvider client={mockedQueryClient}>
  <SourceContextProvider>
    <CustomDichotomousCovariates {...args} />
  </SourceContextProvider>
</QueryClientProvider>;

const studyPopulationCohort = {
  cohort_definition_id: 25,
  cohort_name: 'Mock population ',
  size: 400000,
};

export const SuccessCase = Template.bind({});
SuccessCase.args = {
  dispatch: (payload) => { console.log('dummy dispatch', payload); },
  setMode:  (mode) => { console.log('dummy setMode', mode); },
  type: 'outcome',
  studyPopulationCohort: studyPopulationCohort,
  covariates: [],
  outcome: null

}
SuccessCase.parameters = {
  // msw mocking:
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/cohort-stats/check-overlap/by-source-id/:sourceid/by-cohort-definition-ids/:cohortdefinitionA/:cohortdefinitionB',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinitionA } = req.params;
          const { cohortdefinitionB } = req.params;
          return res(
            ctx.delay(500),
            ctx.json({
              cohort_overlap: {
                case_control_overlap: Math.floor(Math.random() * 10000)+10000,
              }, // because of random here, we get some data that does not really make sense...SuccessCase2 tries to fix that for some of the relevant group overlaps...
            })
          );
        }
      ),
      rest.get('http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid',
      (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params;
        const { cohortdefinitionA } = req.params;
        const { cohortdefinitionB } = req.params;
        return res(
          ctx.delay(800),
          ctx.json({
            cohort_definitions_and_stats: [
              {
                cohort_definition_id: 401,
                cohort_name: 'Mock cohortD - Large',
                size: 221000,
              },
              {
                cohort_definition_id: 400,
                cohort_name: 'Mock cohortC - Large',
                size: 212000,
              },
              {
                cohort_definition_id: 301,
                cohort_name: 'Mock cohortB - medium',
                size: 55296,
              },
              {
                cohort_definition_id: 300,
                cohort_name: 'Mock cohortA loooooong name for testing long names - medium',
                size: 55296,
              },
              {
                cohort_definition_id: 9,
                cohort_name: 'Mock Diabetes Demo',
                size: 293,
              },
              {
                cohort_definition_id: 8,
                cohort_name: 'Mock T1D-cases',
                size: 30,
              },
            ],
          }),
        );
      }),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.args = {
  sourceId: 123,
  selectedStudyPopulationCohort: null,
  selectedCaseCohort: null,
}
// mock endpoint failure:
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.get('http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid',
      (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
