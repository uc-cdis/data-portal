import React from 'react';
import { useQuery } from 'react-query';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, waitFor } from '@testing-library/react';
import SharedContext from '../../Utils/SharedContext';
import JobDetails from './JobDetails';
const setCurrentView = () => 'arbitrary function';
const setSelectedRowData = () => 'another arbitrary function';
const selectedRowData = 'arbitrary variable';
const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const JobDetailsWrapper = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
      value={{
        setCurrentView,
        selectedRowData,
        setSelectedRowData,
      }}
    >
      <JobDetails />
    </SharedContext.Provider>
  </QueryClientProvider>
);

describe('JobDetails', () => {
  it('renders loading spinner while fetching data', async () => {
    render(JobDetailsWrapper());

    // Assert that the loading spinner is rendered
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the component to finish loading
    await waitFor(() => {});

    // Assert that the loading spinner is no longer present
    expect(screen.queryByTestId('spinner')).toBeNull();
  });

  it('renders error message if there is an error fetching data', async () => {
    render(JobDetailsWrapper());

    // Wait for the component to finish loading
    await waitFor(() => {});

    // Assert that the error message is still present
    expect(screen.getByText('Error getting job details')).toBeInTheDocument();
  });

  it('renders job details when data is available', async () => {
    // Mock the useQuery hook to return success status and data
    useQuery.mockReturnValue({
      data: {
        wf_name: 'Test Workflow',
        arguments: {
          parameters: [
            { name: 'n_pcs', value: '3' },
            { name: 'maf_threshold', value: '0.01' },
            { name: 'hare_population', value: 'non-Hispanic Black' },
            { name: 'imputation_score_cutoff', value: '0.3' },
            { name: 'source_population_cohort', value: '9' },
          ],
        },
      },
      status: 'success',
    });

    render(JobDetailsWrapper()););

    // Assert that the job details are rendered
    expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    expect(screen.getByText('Number of PCs')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('MAF Cutoff')).toBeInTheDocument();
    expect(screen.getByText('0.01')).toBeInTheDocument();
    expect(screen.getByText('HARE Ancestry')).toBeInTheDocument();
    expect(screen.getByText('non-Hispanic Black')).toBeInTheDocument();
    expect(screen.getByText('Imputation Score Cutoff')).toBeInTheDocument();
    expect(screen.getByText('0.3')).toBeInTheDocument();
    expect(screen.getByText('Cohort')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
