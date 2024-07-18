import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WorkflowLimitsDashboard from './WorkflowLimitsDashboard';
import { components } from '../../../params';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const testData = {
  workflow_run: 6,
  workflow_limit: 50,
};

const testDataExceeds = {
  workflow_run: 51,
  workflow_limit: 50,
};

const supportEmail = components.login?.email || 'support@datacommons.io';

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
    await waitFor(() => expect(screen.getByTestId('loading-error-message')).toBeInTheDocument(),
    );
  });

  it('should render the invalid data message when test data is invalid', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ invalidKey: 'invalidPair' }),
    });
    render(testJSX());
    await waitFor(() => expect(screen.getByTestId('loading-error-message')).toBeInTheDocument(),
    );
  });

  it(`should render the workflow limits dashboard component and progress bar
     when test data is loaded`, async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(testData),
    });
    render(testJSX());
    await waitFor(() => expect(screen.getByTestId('workflow-limits-message').textContent).toBe(
      `${testData.workflow_run} used from ${testData.workflow_limit} Limit`,
    ),
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it(`should render the a workflow limit exceeded message and progress bar
    when workflow_run exceeds workflow_limit`, async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(testDataExceeds),
    });
    render(testJSX());
    await waitFor(() => expect(screen.getByTestId('workflow-exceeds-message').textContent).toBe(
      'You have exceeded your monthly workflow limit. '
          + 'Please contact support for assistance: '
          + `${supportEmail}.`,
    ),
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
