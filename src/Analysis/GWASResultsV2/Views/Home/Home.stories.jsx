import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Home from './Home';

export default {
  title: 'Tests2/GWASResults/Views/Home',
  component: 'Home',
};

const mockedQueryClient = new QueryClient();

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};
const setCurrentExecutionData = () => alert('setCurrent Execution data called');
const setCurrentResultsData = () => alert('setCurrent Results data called');
const tableData = [
  {
    RunId: 123,
    WorkflowName: 'some workflow name',
    DateTimeStarted: 'DateTimeStarted',
    JobStatus: 'some job status',
    DateTimeSubmitted: 'some date time submitted',
    ExecutionData: 'some ExecutionData for item 1',
    ResultsData: 'some resultsData for item 1',
  },
  {
    RunId: 456,
    WorkflowName: 'some workflow name',
    DateTimeStarted: 'DateTimeStarted',
    JobStatus: 'some job status',
    DateTimeSubmitted: 'some date time submitted',
    ExecutionData: 'some ExecutionData for item 2',
    ResultsData: 'some resultsData for item 2',
  },
];

const MockTemplateSuccess = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
          tableData,
          setCurrentExecutionData,
          setCurrentResultsData,
          setCurrentView,
        }}
      >
        <Home />
      </SharedContext.Provider>
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplateSuccess.bind({});
