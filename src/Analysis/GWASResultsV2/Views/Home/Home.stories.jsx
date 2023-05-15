import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import { rest } from 'msw';
import Home from './Home';
import PHASES from '../../Utils/PhasesEnumeration';
import TableData from '../../TestData/TableData';
import InitialHomeTableState from '../../Utils/StateManagement/InitialHomeTableState';

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

const MockTemplate = () => {
  const [homeTableState, setHomeTableState] = useState(InitialHomeTableState);
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
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
  // simulate a new workflow only at each 3rd request:
  if (requestCount % 3 == 0) {
    workflowList.splice(0, 0, {
      name: 'argo-wrapper-workflow-' + createWorkflowNum(),
      wf_name: 'User Added WF Name ' + requestCount,
      uid: 'uid-' + requestCount,
      phase: getMockPhase(requestCount),
      finishedAt: new Date(new Date() - Math.random() * 1e12).toISOString(),
      submittedAt: new Date(new Date() - Math.random() * 1e12).toISOString(),
    });
    rowCount++;
  }
  // simulate status change of some recent items:
  if (rowCount % 5 == 0) {
    // just some status that is not used in getMockPhase:
    workflowList[2].phase = PHASES.Pending;
    workflowList[3].phase = PHASES.Pending;
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
          return res(ctx.delay(4000), ctx.json(getMockWorkflowList()));
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
