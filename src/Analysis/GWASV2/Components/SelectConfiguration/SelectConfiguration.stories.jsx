import React, { useState, useReducer } from 'react';
import { SourceContextProvider } from '../../Utils/Source';
import reducer from '../../Utils/StateManagement/reducer';
import SelectionConfiguration from './SelectConfiguration';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../GWASV2.css';
import ValidState from '../../TestData/States/ValidState';

export default {
  title: 'Tests3/GWASV2/SelectConfiguration',
  component: SelectionConfiguration,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [state, dispatch] = useReducer(reducer, ValidState);

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <div
          className='GWASV2'
          style={{
            padding: '40px',
            height: '600px',
            background: 'grey',
          }}
        >
          <h1 style={{ color: 'white', textAlign: 'center' }}>
            SelectConfiguration
          </h1>
          <div className='configure-gwas'>
            <div className='configure-gwas_container'>
              <SelectionConfiguration
                numOfPCs={state.numOfPCs}
                mafThreshold={state.mafThreshold}
                imputationScore={state.imputationScore}
                selectedCohort={state.selectedStudyPopulationCohort}
                covariates={state.covariates}
                outcome={state.outcome}
                dispatch={dispatch}
              />
            </div>
          </div>
        </div>
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

      rest.post('http://:serverpath/ga4gh/wes/v2/submit', (req, res, ctx) => {
        const { serverpath } = req.params;
        console.log(serverpath);
        return res(ctx.delay(1100), ctx.text('gwas-workflow-123456'));
      }),
    ],
  },
};
