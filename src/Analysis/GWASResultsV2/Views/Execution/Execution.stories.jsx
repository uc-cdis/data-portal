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

const selectedRowData = {
  name: 'gwas-workflow-9317784556',
  uid: '4b125c09-9712-486f-bacd-ec1451aae935',
};
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
