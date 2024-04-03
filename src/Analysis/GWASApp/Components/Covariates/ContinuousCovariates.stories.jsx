import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import ContinuousCovariates from './ContinuousCovariates';
import { SourceContextProvider } from '../../Utils/Source';

export default {
  title: 'Tests3/GWASApp/ContinuousCovariates',
  component: ContinuousCovariates,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient();

const Template = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <div className='GWASApp'>
          <ContinuousCovariates
            selectedStudyPopulationCohort={{ cohort_definition_id: 123 }}
            selectedCovariates={[]}
            covariates={[]}
            outcome={null}
            handleClose={() => {
              console.log('close');
            }}
            handleSelect={(chosenCovariate) => {
              console.log('chosen covariate:', chosenCovariate);
            }}
            dispatch={(payload) => {
              console.log('payload:', payload);
            }}
            submitButtonLabel={'Add'}
          />
        </div>
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

const mockConcepts = [
  {
    concept_id: 2000006885,
    concept_name: 'Average height ',
    concept_code: '',
    concept_type: 'Measurement',
  },
  {
    concept_id: 2000000280,
    concept_name: 'BMI at enrollment',
    concept_code: '',
    concept_type: 'Measurement',
  },
  {
    concept_id: 2000000323,
    concept_name: 'Age Group',
    concept_code: '',
    concept_type: 'Person',
  },
  {
    concept_id: 2200006885,
    concept_name: 'Average height2 ',
    concept_code: '',
    concept_type: 'Measurement',
  },
  {
    concept_id: 2200000280,
    concept_name: 'BMI at enrollment2',
    concept_code: '',
    concept_type: 'Measurement',
  },
  {
    concept_id: 2200000323,
    concept_name: 'Age Group2',
    concept_code: '',
    concept_type: 'Person',
  },
];

export const SuccessCase = Template.bind({});
SuccessCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { sourceid } = req.params;
          console.log(cohortmiddlewarepath);
          console.log(sourceid);
          return res(
            ctx.delay(1100),
            ctx.json({
              concepts: mockConcepts,
            })
          );
        }
      ),
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
                { start: 1.4564567, end: 10.45642, personCount: 100 },
                { start: 10.45642, end: 20, personCount: 200 },
                { start: 20, end: 30, personCount: 300 },
                { start: 30, end: 40, personCount: 400 },
                { start: 40, end: 50, personCount: 500 },
                { start: 50, end: 60, personCount: 400 },
                { start: 60, end: 70, personCount: 350 },
                { start: 70, end: 80, personCount: 100 },
                { start: 80, end: 90, personCount: 50 },
              ],
            })
          );
        }
      ),
    ],
  },
};

export const EmptyDataCase = Template.bind({});
EmptyDataCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { sourceid } = req.params;
          console.log(cohortmiddlewarepath);
          console.log(sourceid);
          return res(
            ctx.delay(1100),
            ctx.json({
              concepts: mockConcepts,
            })
          );
        }
      ),
      rest.post(
        //histogram/by-source-id/${sourceId}/by-cohort-definition-id/${cohortId}/by-histogram-concept-id/${currentSelection.concept_id}`;
        'http://:cohortmiddlewarepath/cohort-middleware/histogram/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinitionId/by-histogram-concept-id/:conceptId',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinitionId } = req.params;
          return res(
            ctx.delay(1100),
            ctx.json({
              bins: null, // simulates empty data response
            })
          );
        }
      ),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
