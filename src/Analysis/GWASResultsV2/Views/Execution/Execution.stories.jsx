import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Execution from './Execution';
import { rest } from 'msw';

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

const MockTemplate = () => {
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

const MockedFailureJSON = [
  {
    name: 'gwas-workflow-7875715375',
    step_template: 'gwas-workflow',
    error_message: 'No message provided',
  },
  {
    name: 'gwas-workflow-7875715375.get-pheno-csv',
    step_template: 'get-pheno-csv',
    error_message: 'pod deleted',
  },
];

let selectedRowData = {
  name: 'gwas-workflow-787571537',
  uid: '4b125c09-9712-486f-bacd-ec1451aae935',
  startedAt: '2022-02-15T13:00:00Z',
  phase: 'Error',
  DateTimeSubmitted: '2022-02-15T13:30:00Z',
};
let { name, uid } = selectedRowData;

export const MockedFailure = MockTemplate.bind({});
MockedFailure.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(100), ctx.json(MockedFailureJSON));
        }
      ),
    ],
  },
};

selectedRowData.phase = 'Succeeded';
export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(100), ctx.json([]));
        }
      ),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
selectedRowData.phase = '';
MockedError.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/logs/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(
            ctx.delay(100),
            ctx.json({ error: 'Mocked Server error response' })
          );
        }
      ),
    ],
  },
};
