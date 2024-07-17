import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WorkflowLimitsDashboard from './WorkflowLimitsDashboard';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const testData = {
  workflow_run: 6,
  workflow_limit: 50,
};

const testJSX = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <WorkflowLimitsDashboard />
  </QueryClientProvider>
);

describe('Workflow Limits Dashboard', () => {
  it('should render a loading spinner when data is loading', async () => {
    const { container } = render(testJSX());
    expect(container.getElementsByClassName('ant-spin').length).toBe(1);
  });

  it('should render an error message when data loading fails', async () => {
    jest
      .spyOn(window, 'fetch')
      .mockRejectedValueOnce(() => Promise.reject(new Error('error')));
    render(testJSX());
    await waitFor(() =>
      expect(screen.getByTestId('loading-error-message')).toBeInTheDocument()
    );
  });

  it('should render the workflow limits dashboard component with data when test data is loaded', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(testData),
    });
    render(testJSX());
    // await screen.findByText('50');
    await waitFor(() =>
      expect(screen.getByTestId('workflow-limits-message').textContent).toBe(
        `${testData.workflow_run} used from ${testData.workflow_limit} Limit`
      )
    );
    // expect(screen.getByText(testData.workflow_limit)).toBeInTheDocument();
    // expect(screen.getByText(testData.workflow_run)).toBeInTheDocument();
  });
});
