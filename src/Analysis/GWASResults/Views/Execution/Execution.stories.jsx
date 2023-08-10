import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Execution from './Execution';
import { rest } from 'msw';
import './../../GWASResultsContainer.css';

export default {
  title: 'Tests2/GWASResults/Views/Execution',
  component: 'Execution',
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};
const selectedRowData = {
  name: 'gwas-workflow-787571537',
  wf_name: 'user created name',
  uid: '4b125c09-9712-486f-bacd-ec1451aae935',
  startedAt: '2022-02-15T13:00:00Z',
  finishedAt: '2022-02-15T14:00:00Z',
  phase: 'Failed',
  DateTimeSubmitted: '2022-02-15T13:30:00Z',
};
const { name, uid } = selectedRowData;

const MockedFailureJSON = [
  {
    name: 'gwas-workflow-7875715375',
    step_name: 'attrition-table',
    step_template: 'get-attrition-table',
    error_message: 'exit code 1',
    error_interpreted: 'Timeout occurred while fetching attrition table information.'
  },
  {
    name: 'gwas-workflow-7875715375.get-pheno-csv',
    step_name: 'pheno-csv',
    step_template: 'get-pheno-csv',
    error_message: 'exit code 1',
    error_interpreted: ''
  },
];

const MockTemplateFailure = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          selectedRowData,
          setCurrentView,
        }}
      >
        <Execution />
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

const MockTemplateSuccess = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          selectedRowData: { ...selectedRowData, phase: 'Succeeded' },
          setCurrentView,
        }}
      >
        <Execution />
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

export const MockedFailure = MockTemplateFailure.bind({});
MockedFailure.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(ctx.delay(100), ctx.json(MockedFailureJSON));
        }
      ),
    ],
  },
};

export const MockedSuccess = MockTemplateSuccess.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          // Successful executions return an empty array
          return res(ctx.delay(100), ctx.json([]));
        }
      ),
    ],
  },
};

export const MockedErrorObject = MockTemplateFailure.bind({});
MockedErrorObject.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(
            ctx.delay(100),
            // Some errroneous responses can return an error object
            ctx.json({ error: 'Mocked Server error response' })
          );
        }
      ),
    ],
  },
};
export const MockedError403Response = MockTemplateFailure.bind({});
MockedError403Response.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(
            ctx.delay(100),
            ctx.status(403)
          );
        }
      ),
    ],
  },
};
