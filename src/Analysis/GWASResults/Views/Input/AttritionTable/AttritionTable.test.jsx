import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from 'react-query';
import SharedContext from '../../../Utils/SharedContext';
import AttritionTable from './AttrtitionTable';
import MockedSuccessJSON from '../../../TestData/InputViewData/AttritionTableJSON';
import PHASES from '../../../Utils/PhasesEnumeration';
import AttritionTableJSON from '../../../TestData/InputViewData/AttritionTableJSON';

jest.mock('react-query');

describe('Attrition Table', () => {
  const selectedRowData = {
    name: 'workflow_name',
    uid: 'workflow_id',
    phase: PHASES.Succeeded,
  };

  it('renders the component with loading error message', () => {
    useQuery.mockReturnValueOnce({
      status: 'succeeded',
      data: [],
    });

    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <AttritionTable />
      </SharedContext.Provider>
    );
    expect(screen.getByTestId('loading-error-message')).toBeInTheDocument();
  });

  it('renders a loading spinner when fetching data', () => {
    useQuery.mockReturnValueOnce({
      status: 'loading',
      data: null,
    });

    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <AttritionTable />
      </SharedContext.Provider>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders an error message when there is an error fetching data', async () => {
    useQuery.mockReturnValueOnce({
      status: 'error',
      error: new Error('Fetch failed'),
    });

    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <AttritionTable />
      </SharedContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByTestId('loading-error-message')).toBeInTheDocument()
    );
  });

  it('renders the logs when data is fetched successfully', async () => {
    useQuery.mockReturnValueOnce({
      status: 'success',
      data: AttritionTableJSON,
    });
    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <AttritionTable />
      </SharedContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Attrition Table')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
      expect(screen.getByText('Non-Hispanic Black')).toBeInTheDocument();
      expect(screen.getByText('Non-Hispanic Asian')).toBeInTheDocument();
      expect(screen.getByText('Non-Hispanic White')).toBeInTheDocument();
      expect(screen.getByText('Hispanic')).toBeInTheDocument();
    });
  });
});
