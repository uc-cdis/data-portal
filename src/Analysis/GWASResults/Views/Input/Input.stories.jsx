import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Input from './Input';
import { rest } from 'msw';
import MockedSuccessJSON from '../../TestData/InputViewData/MockedSuccessJSON';
import MockedFailureJSON from '../../TestData/InputViewData/MockedFailureJSON';
import './../../GWASResultsContainer.css';

export default {
  title: 'Tests2/GWASResults/Views/Input',
  component: 'Input',
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

const MockTemplate = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          selectedRowData: selectedRowData,
          setCurrentView,
        }}
      >
        <Input />
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

export const MockedFailure = MockTemplate.bind({});
MockedFailure.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(ctx.delay(100), ctx.json(MockedFailureJSON));
        }
      ),
    ],
  },
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(ctx.delay(100), ctx.json(MockedSuccessJSON));
        }
      ),
    ],
  },
};

export const MockedErrorObject = MockTemplate.bind({});
MockedErrorObject.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
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
export const MockedError403Response = MockTemplate.bind({});
MockedError403Response.parameters = {
  msw: {
    handlers: [
      rest.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          return res(ctx.delay(100), ctx.status(403));
        }
      ),
    ],
  },
};
