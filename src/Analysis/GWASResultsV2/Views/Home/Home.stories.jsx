import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import { gwasWorkflowPath } from '../../../../localconf';
import { rest } from 'msw';
import {testTableData} from '../../TestData/testTableData'
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


const MockTemplate = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SharedContext.Provider
        value={{
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

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get('https://swapi.dev/api/films/', (req, res, ctx) => {
        return res(
          ctx.json({
            results: testTableData,
          }),
        );
      }),
    ]
  },
};
