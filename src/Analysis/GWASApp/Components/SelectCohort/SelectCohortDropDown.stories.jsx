import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import SelectCohortDropDown from './SelectCohortDropDown';
import { Space } from 'antd';
import { SourceContextProvider } from '../../Utils/Source';
import './SelectCohort.css';
import '../../GWASApp.css';

export default {
  title: 'Tests3/GWASApp/SelectCohort/SelectCohortDropDown',
  component: SelectCohortDropDown,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient();

const MockTemplate = () => {
  const handleCohortSelect = (selectedCohort) => {
    console.log(selectedCohort);
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <div className='GWASApp'>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <div className='steps-content'></div>
            <h4>Test selecting cohorts using dropdown</h4>
            <SelectCohortDropDown handleCohortSelect={handleCohortSelect} />
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
      rest.get(
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid/by-team-project?team-project=:selectedTeamProject',
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
                  cohort_name:
                    'Test cohort1 with a veeeeeeeerrrrrrryyyyyyy loooooooooooooooooooong name to test how it will be displayed',
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
        'http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid/by-team-project?team-project=:selectedTeamProject',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
