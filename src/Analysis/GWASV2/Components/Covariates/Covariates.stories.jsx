import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import Covariates from './Covariates';
import { SourceContextProvider } from '../../Utils/Source';

export default {
  title: 'Tests3/GWASV2/Covariates',
  component: Covariates,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Template = () => {
  const [selectedCovariate, setSelectedCovariate] = useState(null);

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <Covariates
          selected={selectedCovariate}
          handleSelect={setSelectedCovariate}
        />
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

export const SuccessCase = Template.bind({});
SuccessCase.parameters = {
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
            ],
          }),
        );
      }),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.parameters = {
  msw: {
    handlers: [
      rest.post('http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
