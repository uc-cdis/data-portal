import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import CohortsOverlapDiagram from './CohortsOverlapDiagram';
import { SourceContextProvider } from '../../../Utils/Source';

export default {
  title: 'Tests3/GWASApp/CohortsOverlapDiagram',
  component: CohortsOverlapDiagram,
};

const mockedQueryClient = new QueryClient();

const Template = (args) => (
  <QueryClientProvider client={mockedQueryClient}>
    <SourceContextProvider>
      <CohortsOverlapDiagram {...args} />
    </SourceContextProvider>
  </QueryClientProvider>
);

const selectedStudyPopulationCohort = {
  cohort_definition_id: 25,
  cohort_name: 'Mock population ',
  size: 4000,
};
const selectedCaseCohort = {
  cohort_definition_id: 123,
  cohort_name: 'Mock case cohort A',
  size: 2500,
};
const selectedControlCohort = {
  cohort_definition_id: 456,
  cohort_name:
    'Mock control cohort  with loooong name to test how a long name is rendered',
  size: 1800,
};

export const SuccessCase = Template.bind({});
SuccessCase.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  selectedStudyPopulationCohort: selectedStudyPopulationCohort,
  selectedCaseCohort: selectedCaseCohort,
  selectedControlCohort: selectedControlCohort,
  selectedCovariates: [],
  outcome: null,
};
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
            ctx.delay(1100),
            ctx.json({
              cohort_overlap: {
                case_control_overlap: Math.floor(Math.random() * 500),
              }, // because of random here, we get some data that does not really make sense...SuccessCase2 tries to fix that for some of the relevant group overlaps...
            })
          );
        }
      ),
    ],
  },
};

// similar to test above, but with some overlap values fixed:
export const SuccessCase2 = Template.bind({});
SuccessCase2.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  selectedStudyPopulationCohort: selectedStudyPopulationCohort,
  selectedCaseCohort: selectedCaseCohort,
  selectedControlCohort: selectedControlCohort,
  selectedCovariates: [],
  outcome: null,
};
let variableOverlap = 234;
SuccessCase2.parameters = {
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
                case_control_overlap:
                  cohortdefinitionA ==
                    selectedStudyPopulationCohort.cohort_definition_id &&
                  cohortdefinitionB == selectedCaseCohort.cohort_definition_id
                    ? variableOverlap--
                    : cohortdefinitionA ==
                        selectedCaseCohort.cohort_definition_id &&
                      cohortdefinitionB ==
                        selectedControlCohort.cohort_definition_id
                    ? 1000
                    : Math.floor(Math.random() * 500),
              },
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
  selectedCaseCohort: selectedCaseCohort,
  selectedControlCohort: selectedControlCohort,
  selectedCovariates: [],
  outcome: null,
};
// mock endpoint failure:
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/cohort-stats/check-overlap/by-source-id/:sourceid/by-cohort-definition-ids/:cohortdefinitionA/:cohortdefinitionB',
        (req, res, ctx) =>
          res(
            ctx.delay(800),
            ctx.status(403),
            ctx.json({ errorMessage: `Error` })
          )
      ),
    ],
  },
};

export const TimeoutCase = Template.bind({});
TimeoutCase.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  selectedStudyPopulationCohort: selectedStudyPopulationCohort,
  selectedCaseCohort: selectedCaseCohort,
  selectedControlCohort: selectedControlCohort,
  selectedCovariates: [],
  outcome: null,
};
// mock endpoint timeout:
TimeoutCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/cohort-stats/check-overlap/by-source-id/:sourceid/by-cohort-definition-ids/:cohortdefinitionA/:cohortdefinitionB',
        (req, res, ctx) =>
          res(ctx.delay(3000), ctx.status(504), ctx.json('server timeout'))
      ),
    ],
  },
};
