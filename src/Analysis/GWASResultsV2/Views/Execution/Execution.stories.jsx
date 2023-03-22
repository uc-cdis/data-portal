import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Execution from './Execution';

export default {
  title: 'Tests2/GWASResults/Views/Execution',
  component: 'Execution',
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const selectedRowData = { name: 'Test Name', uid: '123456' };
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

export const MockedSuccess = MockTemplate.bind({});
