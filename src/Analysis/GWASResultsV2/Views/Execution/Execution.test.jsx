import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Execution from './Execution';
import PHASES from '../../Utils/PhasesEnumeration';

jest.mock('react-query');

describe('Execution', () => {
  const selectedRowData = {
    name: 'workflow_name',
    uid: 'workflow_id',
    phase: PHASES.Succeeded,
  };

  it('renders the ExecutionTable component', () => {
    useQuery.mockReturnValueOnce({
      status: 'succeeded',
      data: [],
    });

    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <Execution />
      </SharedContext.Provider>,
    );
    expect(screen.getByTestId('execution-table')).toBeInTheDocument();
    expect(screen.getByText('Workflow Succeeded')).toBeInTheDocument();
  });

  it('renders a loading spinner when fetching data', () => {
    useQuery.mockReturnValueOnce({
      status: 'loading',
      data: null,
    });

    const { container } = render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <Execution />
      </SharedContext.Provider>,
    );
    expect(container.getElementsByClassName('ant-spin').length).toBe(1);
  });

  it('renders an error message when there is an error fetching data', () => {
    useQuery.mockReturnValueOnce({
      status: 'error',
      error: new Error('Fetch failed'),
    });

    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <Execution />
      </SharedContext.Provider>,
    );

    expect(
      screen.getByText('Error loading data for table'),
    ).toBeInTheDocument();
  });

  it('renders the logs when data is fetched successfully', async () => {
    useQuery.mockReturnValueOnce({
      status: 'success',
      data: [
        {
          name: 'Step 1',
          step_template: 'Step 1 Template',
          error_message: null,
        },
        {
          name: 'Step 2',
          step_template: 'Step 2 Template',
          error_message: 'Step 2 Error',
        },
      ],
    });
    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <Execution />
      </SharedContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Logs')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 1 Template')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 2 Template')).toBeInTheDocument();
      expect(screen.getByText('Step 2 Error')).toBeInTheDocument();
    });
  });
});
