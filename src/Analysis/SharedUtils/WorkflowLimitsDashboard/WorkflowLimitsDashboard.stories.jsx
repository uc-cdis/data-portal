import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { http, HttpResponse, delay } from 'msw';
import WorkflowLimitsDashboard from './WorkflowLimitsDashboard';

export default {
  title: 'TESTS1/SharedUtils/WorkflowLimitsDashboard',
  component: 'WorkflowLimitsDashboard',
};
const oneSecondInMilliseconds = 1000;
const fifteenMinutesInMilliseconds = 900000;
const exceedsWorkflowLimitObject = { workflow_run: 50, workflow_limit: 50 };
const invalidWorkflowLimitObject = { invalidKey: 123 };
const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <WorkflowLimitsDashboard />
    </QueryClientProvider>
  );
};

let requestCount = 0;
const getValidMockWorkflowLimitsInfo = () => {
  requestCount++;
  return { workflow_run: requestCount, workflow_limit: 50 };
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      http.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        async ({ params }) => {
          const { argowrapperpath } = params;
          console.log(argowrapperpath);
          await delay(oneSecondInMilliseconds);
          return HttpResponse.json(getValidMockWorkflowLimitsInfo());
        }
      ),
    ],
  },
};

export const MockedSuccessOverLimit = MockTemplate.bind({});
MockedSuccessOverLimit.parameters = {
  msw: {
    handlers: [
      http.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        async ({ params }) => {
          const { argowrapperpath } = params;
          console.log(argowrapperpath);
          await delay(oneSecondInMilliseconds * 2);
          return HttpResponse.json(exceedsWorkflowLimitObject);
        }
      ),
    ],
  },
};

export const MockedLoading = MockTemplate.bind({});
MockedLoading.parameters = {
  msw: {
    handlers: [
      http.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        async ({ params }) => {
          const { argowrapperpath } = params;
          console.log(argowrapperpath);
          await delay(fifteenMinutesInMilliseconds);
          return HttpResponse.json(getValidMockWorkflowLimitsInfo());
        }
      ),
    ],
  },
};

export const MockedError500 = MockTemplate.bind({});
MockedError500.parameters = {
  msw: {
    handlers: [
      http.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        async ({ params }) => {
          const { argowrapperpath } = params;
          console.log(argowrapperpath);
          await delay(oneSecondInMilliseconds);
          return HttpResponse.json(invalidWorkflowLimitObject, { status: 500 });
        }
      ),
    ],
  },
};
export const MockedErrorInvalidData = MockTemplate.bind({});
MockedErrorInvalidData.parameters = {
  msw: {
    handlers: [
      http.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        async ({ params }) => {
          const { argowrapperpath } = params;
          console.log(argowrapperpath);
          await delay(oneSecondInMilliseconds);
          return HttpResponse.json(invalidWorkflowLimitObject);
        }
      ),
    ],
  },
};
