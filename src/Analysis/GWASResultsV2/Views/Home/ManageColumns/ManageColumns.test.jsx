import React from 'react';
import SharedContext from '../../../Utils/SharedContext';
import '@testing-library/jest-dom';
import {
  render, fireEvent, getByRole, screen,
} from '@testing-library/react';
import ManageColumns from './ManageColumns';
import InitialHomeTableState from '../../../Utils/InitialHomeTableState';

describe('ManageColumns', () => {
  const state = {
    homeTableState: {
      columnManagement: {
        runId: true,
        workflowName: true,
        dateSubmitted: true,
        jobStatus: true,
        dateFinished: true,
        viewDetails: true,
        actions: true,
      },
      setHomeTableState: jest.fn(),
    },
  };

  it('renders all columns with correct default values', () => {
    const { container } = render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(screen.getByText('Run ID')).toBeInTheDocument();
    // expect(container.getElementsByClassName('ant-switch-checked').length).toBe(6);
    /*     expect(getByLabelText('Run ID')).toBeChecked();
    expect(getByText('Workflow Name')).toBeInTheDocument();
    expect(getByLabelText('Workflow Name')).toBeChecked();
    expect(getByText('Date/Time Submitted')).toBeInTheDocument();
    expect(getByLabelText('Date/Time Submitted')).toBeChecked();
    expect(getByText('Job Status')).toBeInTheDocument();
    expect(getByLabelText('Job Status')).toBeChecked();
    expect(getByText('Date/Time Finished')).toBeInTheDocument();
    expect(getByLabelText('Date/Time Finished')).toBeChecked();
    expect(getByText('View Details')).toBeInTheDocument();
    expect(getByLabelText('View Details')).toBeChecked();
    expect(getByText('Actions')).toBeInTheDocument();
    expect(getByLabelText('Actions')).toBeChecked();
 */ });
/*
  it('toggles Run ID column when switch is clicked', () => {
    const { getByLabelText } = render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );

    fireEvent.click(getByLabelText('Run ID'));

    expect(state.homeTableState.setHomeTableState).toHaveBeenCalledWith({
      ...state.homeTableState.homeTableState,
      sortInfo: {},
      currentPage: 1,
      nameSearchTerm: '',
      columnManagement: {
        ...state.homeTableState.homeTableState.columnManagement,
        runId: false,
      },
    });
  });

  it('toggles Workflow Name column when switch is clicked', () => {
    const { getByLabelText } = render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>,
    );

    fireEvent.click(getByLabelText('Workflow Name'));

    expect(state.homeTableState.setHomeTableState).toHaveBeenCalledWith({
      ...state.homeTableState.homeTableState,
      sortInfo: {},
      currentPage: 1,
      wfNameSearchTerm: '',
      columnManagement: {
        ...state.homeTableState.homeTableState.columnManagement,
        workflowName: false,
      },
    });
  });
*/
  // add more tests for other columns
});
