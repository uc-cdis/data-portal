import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Results from './Results';
import WorkflowStatusResponse from '../../TestData/WorkflowDetails';
import * as analysisJobModule from '../../../AnalysisJob';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const setCurrentView = () => 'arbitrary function';
const setSelectedRowData = () => 'another arbitrary function';
const selectedRowData = 'arbitrary variable';
const resultsWrapper = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
      value={{
        setCurrentView,
        selectedRowData,
        setSelectedRowData,
      }}
    >
      <Results />
    </SharedContext.Provider>
  </QueryClientProvider>
);

describe('Results component', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should render a loading spinner when data is loading, and an error when it fails', async () => {
    const { container } = render(resultsWrapper());
    expect(container.getElementsByClassName('ant-spin').length).toBe(1);

    // endpoints not mocked, so it will fail. We expect an error to show up:
    await flushPromises();
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should trigger a call to the pre-signed url endpoint with a correctly parsed "did" on startup', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      // return mock response with the "did" value we want to check at the end:
      json: jest.fn().mockResolvedValueOnce(WorkflowStatusResponse),
    });

    let didUsed = 0;
    let methodUsed = '';

    // replace the getPresignedUrl() method with a simple one that just collects its arguments:
    jest.spyOn(analysisJobModule, 'getPresignedUrl').mockImplementation((did, method) => {
      didUsed = did;
      methodUsed = method;
    });

    // render the component, which will internally trigger the call to getPresignedUrl():
    render(resultsWrapper());
    // flush the pending mock web-service responses:
    await flushPromises();
    // check results:
    expect(didUsed).toBe('999-8888-7777-aaaa123456-777777');
    expect(methodUsed).toBe('download');
  });
});
