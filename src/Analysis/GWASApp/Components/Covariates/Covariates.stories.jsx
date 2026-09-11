import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { http, HttpResponse, delay } from 'msw';
import Covariates from './Covariates';
import { SourceContextProvider } from '../../Utils/Source';

export default {
  title: 'Tests3/GWASApp/Covariates',
  component: Covariates,
};

// useful examples: https://github.com/mswjs/msw-storybook-addon/tree/main/packages/docs/src/demos/react-query

const mockedQueryClient = new QueryClient();

const Template = () => {
  const [selectedCovariate, setSelectedCovariate] = useState(null);

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <Covariates
          selected={selectedCovariate}
          handleSelect={setSelectedCovariate}
          submittedCovariateIds={[]}
        />
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

export const SuccessCase = Template.bind({});
SuccessCase.parameters = {
  msw: {
    handlers: [
      http.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type',
        async ({ params }) => {
          const { cohortmiddlewarepath } = params;
          const { sourceid } = params;
          console.log(cohortmiddlewarepath);
          console.log(sourceid);
          await delay(1100);
          return HttpResponse.json({
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
          });
        }
      ),
    ],
  },
};

export const ErrorCase = Template.bind({});
ErrorCase.parameters = {
  msw: {
    handlers: [
      http.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept/by-source-id/:sourceid/by-type',
        async ({ params }) => {
          await delay(3000);
          return new HttpResponse(null, { status: 403, statusText: 'error' });
        }
      ),
    ],
  },
};
