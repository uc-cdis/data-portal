import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import { rest } from 'msw';
import Home from './Home';
import testTableData from '../../TestData/testTableData';

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};
const setSelectedRowData = () => alert('setSelectedRowData called');

export default {
  title: 'Tests2/GWASResults/Views/Home',
  component: 'Home',
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () =>
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          setSelectedRowData,
          setCurrentView,
        }}
      >
        <Home />
      </SharedContext.Provider>
    </QueryClientProvider>

let requestCount = 0;
let rowCount = 1;
const gwasStatus = {
  pending: 'Pending',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
  error: 'Error',
};

const getMockPhase = (requestCount) => {
  if (requestCount % 2 == 0) {
    return gwasStatus.running;
  } else if (requestCount % 5 == 0) {
    return gwasStatus.failed;
  } else {
    return gwasStatus.succeeded;
  }
};

let workflowList = testTableData;

const getMockWorkflowList = () => {
  requestCount++;
  // simulate a new workflow only at each 3rd request:
  if (requestCount % 3 == 0) {
    workflowList.splice(0, 0, {
      name: 'argo-wrapper-workflow-' + requestCount,
      uid: 'uid-' + requestCount,
      phase: getMockPhase(requestCount),
      startedAt: new Date(new Date() - Math.random()*(1e+12))
    });
    rowCount++;
  }
  // simulate status change of some recent items at each 10th request:
  if (rowCount % 5 == 0) {
    // just some status that is not used in getMockPhase:
    workflowList[2].phase = gwasStatus.pending;
    workflowList[3].phase = gwasStatus.pending;
  }
  console.log('workflowList: ',workflowList)
  return workflowList;
};

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(100), ctx.json(getMockWorkflowList()));
        }
      ),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post('', (req, res, ctx) => res(ctx.delay(800), ctx.status(403))),
    ],
  },
};
