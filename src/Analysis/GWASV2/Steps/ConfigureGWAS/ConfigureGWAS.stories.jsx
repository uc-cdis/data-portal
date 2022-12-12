import React, { useState, useReducer } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Button } from 'antd';
import { rest } from 'msw';
import reducer from '../../Shared/StateManagement/reducer';
import ConfigureGWAS from './ConfigureGWAS';
import { SourceContextProvider } from '../../Shared/Source';
import ACTIONS from '../../Shared/StateManagement/Actions';

export default {
  title: 'Tests3/GWASV2/Steps/ConfigureGWAS',
  component: ConfigureGWAS,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const initialState = {
    outcome: {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute8',
    },
    selectedStudyPopulationCohort: {
      cohort_definition_id: 9,
      cohort_name: 'Diabetes Demo',
      size: 293,
    },
    covariates: [],
    imputationScore: 0.3,
    mafThreshold: 0.01,
    numOfPC: 3,
    gwasName: '',
    selectedHare: {
      concept_value: '',
    },
    currentStep: 3,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  let nextButtonEnabled = true;

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <h1 style={{ textAlign: 'center' }}>Configure GWAS (Step 4)</h1>
        <ConfigureGWAS
          dispatch={dispatch}
          numOfPCs={state.numPCs}
          mafThreshold={state.mafThreshold}
          imputationScore={state.imputationScore}
          selectedHare={state.selectedHare}
          covariates={state.covariates}
          selectedCohort={state.selectedStudyPopulationCohort}
          outcome={state.outcome}
          showModal={false}
        />
        <Button
          style={{ marginTop: '3em', float: 'left' }}
          className='GWASUI-navBtn GWASUI-navBtn__next'
          type='primary'
          onClick={() => {
            dispatch({ type: ACTIONS.DECREMENT_CURRENT_STEP });
          }}
          disabled={state.currentStep < 1}
        >
          Previous
        </Button>
        <Button
          style={{ marginTop: '3em', float: 'right' }}
          className='GWASUI-navBtn GWASUI-navBtn__next'
          type='primary'
          onClick={() => {
            dispatch({ type: ACTIONS.INCREMENT_CURRENT_STEP });
          }}
          disabled={!nextButtonEnabled}
        >
          Next
        </Button>
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
