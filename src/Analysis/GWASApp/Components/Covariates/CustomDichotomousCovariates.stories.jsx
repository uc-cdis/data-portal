import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import CustomDichotomousCovariates from './CustomDichotomousCovariates';
import { SourceContextProvider } from '../../Utils/Source';
import '../../GWASApp.css';

export default {
  title: 'Tests3/GWASApp/CustomDichotomousCovariates',
  component: CustomDichotomousCovariates,
};

const mockedQueryClient = new QueryClient();

const Template = (args) => (
  <QueryClientProvider client={mockedQueryClient}>
    <style jsx>
      {`
        .custom-dichotomous-covariates .GWASUI-flexRow {
          width: 100%;
        }
      `}
    </style>
    <SourceContextProvider>
      <div className='GWASApp' style={{ background: '#f5f5f5' }}>
        <div className='steps-content'>
          <div className='GWASUI-double-column'>
            <div className='select-container' style={{ background: '#fff' }}>
              <CustomDichotomousCovariates {...args} />
            </div>
          </div>
        </div>
      </div>
    </SourceContextProvider>
  </QueryClientProvider>
);

const studyPopulationCohort = {
  cohort_definition_id: 25,
  cohort_name: 'Mock population ',
  size: 400000,
};

export const SuccessAndZeroOverlapCases = Template.bind({});
SuccessAndZeroOverlapCases.args = {
  dispatch: (payload) => {
    console.log('dummy dispatch', payload);
  },
  handleSelect: (selectedPair) => {
    console.log('dummy handleSelect', selectedPair);
  },
  handleClose: () => {
    console.log('dummy handleClose');
  },
  studyPopulationCohort: studyPopulationCohort,
  covariates: [],
  outcome: null,
  submitButtonLabel: 'Submit!!',
};
const dummyNoOverlapCohortId = 30001;
SuccessAndZeroOverlapCases.parameters = {
  // msw mocking:
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/cohort-stats/check-overlap/by-source-id/:sourceid/by-cohort-definition-ids/:cohortdefinitionA/:cohortdefinitionB',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinitionA } = req.params;
          const { cohortdefinitionB } = req.params;
          // default random overlap:
          let overlap = Math.floor(Math.random() * 10000) + 10000;
          if (
            parseInt(cohortdefinitionA) === dummyNoOverlapCohortId ||
            parseInt(cohortdefinitionB) === dummyNoOverlapCohortId
          ) {
            // set overlap to 0 to trigger a validation scenario in the component:
            overlap = 0;
          }
          return res(
            ctx.delay(500),
            ctx.json({
              cohort_overlap: {
                case_control_overlap: overlap,
              }, // because of random here, we get some data that does not really make sense...SuccessCase2 tries to fix that for some of the relevant group overlaps...
            })
          );
        }
      ),
      rest.get(
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid/by-team-project?team-project=:selectedTeamProject',
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
                  cohort_definition_id: dummyNoOverlapCohortId,
                  cohort_name: 'NO OVERLAP Mock cohortB - medium',
                  size: 55296,
                },
                {
                  cohort_definition_id: 300,
                  cohort_name:
                    'Mock cohortA loooooong name for testing long names - medium',
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
            })
          );
        }
      ),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.args = {
  sourceId: 123,
  selectedStudyPopulationCohort: null,
  selectedCaseCohort: null,
};
// mock endpoint failure:
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid/by-team-project?team-project=:selectedTeamProject',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
