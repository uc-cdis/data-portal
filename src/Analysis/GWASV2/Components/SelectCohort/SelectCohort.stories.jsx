import React, { useReducer } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import CohortSelect from './SelectCohort';
import reducer from '../../Utils/StateManagement/reducer';
import { Space } from 'antd';
import { SourceContextProvider } from '../../Utils/Source';
import ACTIONS from '../../Utils/StateManagement/Actions';
import './SelectCohort.css';
import '../../../GWASV2/GWASV2.css';
import '../../../GWASUIApp/GWASUIApp.css';

export default {
  title: 'Tests3/GWASV2/CohortSelect/CohortSelect',
  component: CohortSelect,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const initialState = {
    outcome: {},
    selectedStudyPopulationCohort: {
      cohort_definition_id: 400,
      cohort_name: 'Test cohortC - Large (do not run generate)',
      size: 200000,
    },
    covariates: [],
    imputationScore: 0.3,
    mafThreshold: 0.01,
    numOfPC: 3,
    gwasName: '',
    selectedHare: {
      concept_value: '',
    },
    currentStep: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleStudyPopulationSelect = (selectedRow) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT,
      payload: selectedRow,
    });
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <div className='GWASV2'>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <div className='steps-content'></div>
            <h4>
              Use this App to perform high throughput GWAS on Million Veteran
              Program (MVP) data, using the University of Washington Genesis
              pipeline
            </h4>
            <CohortSelect
              selectedCohort={state.selectedStudyPopulationCohort}
              handleCohortSelect={handleStudyPopulationSelect}
            />
          </Space>
        </div>
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      ///cohort-middleware/cohortdefinition-stats/by-source-id/1
      rest.get(
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { sourceid } = req.params;
          console.log(cohortmiddlewarepath);
          console.log(sourceid);
          return res(
            ctx.delay(1100),
            ctx.json({
              cohort_definitions_and_stats: [
                {
                  cohort_definition_id: 1,
                  cohort_name: 'Test cohort1',
                  size: 6,
                },
                {
                  cohort_definition_id: 2,
                  cohort_name: 'Test cohort2',
                  size: 2,
                },
                {
                  cohort_definition_id: 3,
                  cohort_name: 'Test cohort3',
                  size: 1,
                },
                {
                  cohort_definition_id: 4,
                  cohort_name: 'Test cohort4',
                  size: 6,
                },
                {
                  cohort_definition_id: 5,
                  cohort_name: 'Test cohort5',
                  size: 2,
                },
                {
                  cohort_definition_id: 6,
                  cohort_name: 'Test cohort6',
                  size: 1,
                },
                {
                  cohort_definition_id: 7,
                  cohort_name: 'Test cohort7',
                  size: 6,
                },
                {
                  cohort_definition_id: 8,
                  cohort_name: 'Test cohort8',
                  size: 2,
                },
                {
                  cohort_definition_id: 9,
                  cohort_name: 'Test cohort9',
                  size: 1,
                },
                {
                  cohort_definition_id: 10,
                  cohort_name: 'Test cohort10',
                  size: 6,
                },
                {
                  cohort_definition_id: 11,
                  cohort_name: 'Test cohort11',
                  size: 2,
                },
                {
                  cohort_definition_id: 12,
                  cohort_name: 'Test cohort12',
                  size: 1,
                },
                {
                  cohort_definition_id: 13,
                  cohort_name: 'Test cohort13',
                  size: 6,
                },
                {
                  cohort_definition_id: 14,
                  cohort_name: 'Test cohort14',
                  size: 2,
                },
                {
                  cohort_definition_id: 15,
                  cohort_name: 'Test cohort15',
                  size: 1,
                },
                {
                  cohort_definition_id: 16,
                  cohort_name: 'Test cohort16',
                  size: 6,
                },
                {
                  cohort_definition_id: 17,
                  cohort_name: 'Test cohort17',
                  size: 2,
                },
                {
                  cohort_definition_id: 18,
                  cohort_name: 'Test cohort18',
                  size: 1,
                },
                {
                  cohort_definition_id: 19,
                  cohort_name: 'Test cohort19',
                  size: 6,
                },
                {
                  cohort_definition_id: 20,
                  cohort_name: 'Test cohort20',
                  size: 2,
                },
                {
                  cohort_definition_id: 21,
                  cohort_name: 'Test cohort21',
                  size: 1,
                },
                {
                  cohort_definition_id: 22,
                  cohort_name: 'Test cohort22',
                  size: 6,
                },
                {
                  cohort_definition_id: 23,
                  cohort_name: 'Test cohort23',
                  size: 2,
                },
                {
                  cohort_definition_id: 24,
                  cohort_name: 'Test cohort24',
                  size: 1,
                },
                {
                  cohort_definition_id: 25,
                  cohort_name: 'Test cohort25',
                  size: 6,
                },
                {
                  cohort_definition_id: 26,
                  cohort_name: 'Test cohort26',
                  size: 2,
                },
                {
                  cohort_definition_id: 27,
                  cohort_name: 'Test cohort27',
                  size: 1,
                },
                {
                  cohort_definition_id: 28,
                  cohort_name: 'Test cohort28',
                  size: 6,
                },
                {
                  cohort_definition_id: 29,
                  cohort_name: 'Test cohort29',
                  size: 2,
                },
                {
                  cohort_definition_id: 30,
                  cohort_name: 'Test cohort30',
                  size: 1,
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
      rest.get(
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
