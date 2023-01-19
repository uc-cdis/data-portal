import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import CustomDichotomousSelect from './CustomDichotomousSelect';

export default {
  title: 'Tests2/GWASUI/CustomDichotomousSelect',
  component: CustomDichotomousSelect,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([]);

  const handleCDAdd = (cd) => {
    if (!prevCDArr.includes(cd)) {
      setSelectedDichotomousCovariates((prevCDArr) => [...prevCDArr, cd]);
    }
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <CustomDichotomousSelect
        sourceId={1}
        handleCDAdd={handleCDAdd}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        current={1}
      />
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get('http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid', (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params;
        const { sourceid } = req.params;
        console.log(cohortmiddlewarepath);
        console.log(sourceid);
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

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.get('http://:cohortmiddlewarepath/cohort-middleware/cohortdefinition-stats/by-source-id/:sourceid', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
