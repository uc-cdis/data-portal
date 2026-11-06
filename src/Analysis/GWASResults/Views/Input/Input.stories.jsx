import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Input from './Input';
import { http, HttpResponse, delay } from 'msw';
import MockedSuccessJSON from '../../TestData/InputViewData/MockedSuccessJSON';
import MockedFailureJSON from '../../TestData/InputViewData/MockedFailureJSON';
import AttritionTableJSON from '../../TestData/InputViewData/AttritionTableJSON';
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
        <div className='GWASResults'>
          <Input />
        </div>
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

export const MockedFailure = MockTemplate.bind({});
MockedFailure.parameters = {
  msw: {
    handlers: [
      http.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        async ({ params }) => {
          const { argowrapperpath } = params;
          await delay(100);
          return HttpResponse.json(MockedFailureJSON);
        }
      ),
    ],
  },
};

const dummyS3BucketLocation =
  'https://some-bucket.s3.amazonaws.com/gwas-workflow-123/test_pheweb.json';
export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      http.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        async ({ params }) => {
          const { argowrapperpath } = params;
          await delay(100);
          return HttpResponse.json(MockedSuccessJSON);
        }
      ),
      http.get(
        'http://:server/user/data/download/:index_did',
        async ({ params }) => {
          const { index_did } = params;
          console.log(index_did);
          await delay(500);
          return HttpResponse.json({
            url: dummyS3BucketLocation + '?X-Amz-Algorithm=AWS4-ETC',
          });
        }
      ),
      http.get(dummyS3BucketLocation, async ({ params }) => {
        const { index_did } = params;
        console.log(index_did);
        await delay(500);
        return HttpResponse.json(AttritionTableJSON);
      }),
    ],
  },
};

export const MockedError500Response = MockTemplate.bind({});
MockedError500Response.parameters = {
  msw: {
    handlers: [
      http.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        async ({ params }) => {
          const { argowrapperpath } = params;
          await delay(100);
          // Some errroneous responses can return an error object
          return HttpResponse.json({ error: 'Mocked Server error response' }, { status: 500 });
        }
      ),
    ],
  },
};
export const MockedError403Response = MockTemplate.bind({});
MockedError403Response.parameters = {
  msw: {
    handlers: [
      http.get(
        `http://:argowrapperpath/ga4gh/wes/v2/status/${name}?uid=${uid}`,
        async ({ params }) => {
          const { argowrapperpath } = params;
          await delay(100);
          return new HttpResponse(null, { status: 403 });
        }
      ),
    ],
  },
};
