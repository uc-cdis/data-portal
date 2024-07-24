import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
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
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(oneSecondInMilliseconds), ctx.json(getValidMockWorkflowLimitsInfo()));
        }
      ),
    ],
  },
};

export const MockedSuccessOverLimit = MockTemplate.bind({});
MockedSuccessOverLimit.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(
            ctx.delay(oneSecondInMilliseconds * 2),
            ctx.json(exceedsWorkflowLimitObject)
          );
        }
      ),
    ],
  },
};

export const MockedLoading = MockTemplate.bind({});
MockedLoading.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(
            ctx.delay(fifteenMinutesInMilliseconds),
            ctx.json(getValidMockWorkflowLimitsInfo())
          );
        }
      ),
    ],
  },
};

export const MockedError500 = MockTemplate.bind({});
MockedError500.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(oneSecondInMilliseconds), ctx.status(500), ctx.json(invalidWorkflowLimitObject));
        }
      ),
    ],
  },
};
export const MockedErrorInvalidData = MockTemplate.bind({});
MockedErrorInvalidData.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows/user-monthly',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(oneSecondInMilliseconds), ctx.json(invalidWorkflowLimitObject));
        }
      ),
    ],
  },
};
