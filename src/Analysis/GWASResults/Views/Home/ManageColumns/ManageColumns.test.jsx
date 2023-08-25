import React from 'react';
import '@testing-library/jest-dom';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import SharedContext from '../../../Utils/SharedContext';
import ManageColumns from './ManageColumns';
import InitialHomeTableState from '../HomeTableState/InitialHomeTableState';
import DefaultColumnManagement from '../HomeTableState/DefaultColumnManagement';

describe('ManageColumns', () => {
  const state = {
    homeTableState: InitialHomeTableState,
    setHomeTableState: jest.fn(),
  };

  const rowNames = [
    'Restore Defaults',
    'Run ID',
    'Workflow Name',
    'Date/Time Submitted',
    'Job Status',
    'Date/Time Finished',
    'View Details',
    'Actions',
  ];
  const expectedNumberOfSwitches = Object.keys(DefaultColumnManagement).length;

  it('renders manage columns button and all row names with correct default values', async () => {
    render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );
    const button = screen.getByText('Manage columns');
    fireEvent.click(button);
    await waitFor(() => {
      rowNames.forEach((rowName) => {
        expect(screen.getByText(rowName)).toBeInTheDocument();
      });
    });
  });

  it('renders all switches initially as checked', async () => {
    render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const checkedSwitches = await screen.findAllByRole('switch', {
      checked: true,
    });
    expect(checkedSwitches).toHaveLength(expectedNumberOfSwitches);
  });
  it('Calls setHomeTableState with correct data after toggling a switch', async () => {
    render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Run ID')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Run ID'));
    expect(state.setHomeTableState).toHaveBeenCalledWith({
      ...state.homeTableState,
      sortInfo: {},
      currentPage: 1,
      nameSearchTerm: '',
      columnManagement: {
        ...state.homeTableState.columnManagement,
        showRunId: false,
      },
    });
  });
  it('Calls setHomeTableState with correct data after restore defaults is clicked', async () => {
    render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Restore Defaults')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Restore Defaults'));
    expect(state.setHomeTableState).toHaveBeenCalledWith({
      ...state.homeTableState,
      sortInfo: {},
      currentPage: 1,
      nameSearchTerm: '',
      columnManagement: DefaultColumnManagement,
    });
  });
});
