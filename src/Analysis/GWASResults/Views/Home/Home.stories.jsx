import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import { rest } from 'msw';
import Home from './Home';
import PHASES from '../../Utils/PhasesEnumeration';
import TableData from '../../TestData/TableData';
import InitialHomeTableState from './HomeTableState/InitialHomeTableState';

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};

export default {
  title: 'Tests2/GWASResults/Views/Home',
  component: 'Home',
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {
  const [selectedRowData, setSelectedRowData] = useState({});
  const [homeTableState, setHomeTableState] = useState(InitialHomeTableState);
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          selectedRowData,
          setSelectedRowData,
          setCurrentView,
          homeTableState,
          setHomeTableState,
        }}
      >
        <Home />
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

let requestCount = 0;
let rowCount = 1;

const getMockPhase = (requestCount) => {
  if (requestCount % 2 === 0) {
    return PHASES.Running;
  } else if (requestCount % 5 === 0) {
    return PHASES.Error;
  } else if (requestCount % 7 === 0) {
    return PHASES.Failed;
  } else if (requestCount % 9 === 0) {
    return PHASES.Pending;
  } else {
    return PHASES.Succeeded;
  }
};

let workflowList = TableData;
const minWorkflowNum = 1e8;
const maxWorkflowNum = 1e9 - 1;
const createWorkflowNum = () =>
  Math.round(
    Math.random() * (maxWorkflowNum - minWorkflowNum) + minWorkflowNum
  );

const getMockWorkflowList = () => {
  requestCount++;
  // simulate a new workflow only at each 2nd request:
  if (requestCount % 2 == 0) {
    workflowList.splice(0, 0, {
      name: 'argo-wrapper-workflow-' + createWorkflowNum(),
      wf_name: 'User Added WF Name ' + requestCount,
      uid: 'uid-' + requestCount,
      phase: getMockPhase(requestCount/2),
      finishedAt: new Date(new Date() - Math.random() * 1e12).toISOString(),
      submittedAt: new Date(new Date() - Math.random() * 1e12).toISOString(),
    });
    rowCount++;
  }
  // simulate status change of some recent items:
  if (rowCount % 3 == 0) {
    workflowList[1].phase = PHASES.Succeeded;
    workflowList[2].phase = PHASES.Failed;
  }
  console.log('workflowList: ', workflowList);
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
          return res(ctx.delay(2000), ctx.json(getMockWorkflowList()));
        }
      ),
      rest.post(
        'http://:argowrapperpath/ga4gh/wes/v2/retry/:workflow',
        (req, res, ctx) => {
          const { argowrapperpath, workflow } = req.params;
          console.log(argowrapperpath);
          console.log(workflow);
          return res(ctx.delay(800), ctx.text(`${workflow} retried sucessfully`));
        }
      ),
    ],
  },
};

export const MockedSuccessButFailedRetry = MockTemplate.bind({});
MockedSuccessButFailedRetry.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(2000), ctx.json(getMockWorkflowList()));
        }
      ),
      rest.post(
        'http://:argowrapperpath/ga4gh/wes/v2/retry/:workflow',
        (req, res, ctx) => {
          const { argowrapperpath, workflow } = req.params;
          console.log(argowrapperpath);
          console.log(workflow);
          return res(ctx.delay(800), ctx.status(500), ctx.text(`${workflow} retry failed`));
        }
      ),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/workflows',
        (req, res, ctx) => {
          const { argowrapperpath } = req.params;
          console.log(argowrapperpath);
          return res(ctx.delay(1000), ctx.status(500), ctx.json({"test":123}));
        }
      ),
    ],
  },
};
