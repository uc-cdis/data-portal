import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import Covariates from './Covariates';

export default {
  title: 'Tests2/GWASUI/Covariates',
  component: Covariates,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedCovariates, setSelectedCovariates] = useState([]);

  const handleCovariateSelect = (cov) => {
    setSelectedCovariates(cov);
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <Covariates
        sourceId={1}
        searchTerm={''}
        selectedCovariates={selectedCovariates}
        handleCovariateSelect={handleCovariateSelect}
      />
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type', (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params;
        const { sourceid } = req.params;
        console.log(cohortmiddlewarepath);
        console.log(sourceid);
        return res(
          ctx.delay(1100),
          ctx.json({
            concepts: [
              {
                concept_id: 2000006885,
                prefixed_concept_id: 'ID_2000006885',
                concept_name: 'Average height ',
                concept_code: '',
                concept_type: 'Measurement',
              },
              {
                concept_id: 2000000280,
                prefixed_concept_id: 'ID_2000000280',
                concept_name: 'BMI at enrollment',
                concept_code: '',
                concept_type: 'Measurement',
              },
              {
                concept_id: 2000000323,
                prefixed_concept_id: 'ID_2000000323',
                concept_name: 'MVP Age Group',
                concept_code: '',
                concept_type: 'Person',
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
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
