import React from 'react';
import '@testing-library/jest-dom';
import SharedContext from '../../../Utils/SharedContext';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ManageColumns from './ManageColumns';
import InitialHomeTableState from '../../../Utils/InitialHomeTableState';

describe('ManageColumns', () => {
  const state = {
    homeTableState: InitialHomeTableState,
    setHomeTableState: jest.fn(),
  };

  const rowNames = [
    'Restore Defaults'
    'Run ID',
    'Workflow Name',
    'Date/Time Submitted',
    'Job Status',
    'Date/Time Finished',
    'View Details',
    'Actions',
  ];
  it('renders all row with correct default values', async () => {
    render(
      <SharedContext.Provider value={state}>
        <ManageColumns />
      </SharedContext.Provider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      rowNames.forEach((rowName) => {
        expect(screen.getByText(rowName)).toBeInTheDocument();
      });
    });

    /*
    expect(
      container.querySelectorAll('.manage-columns-switch .ant-switch-checked')
        .length
    ).toBe(6);
    */
  });

  // expect(container.getElementsByClassName('ant-switch-checked').length).toBe(6);
  /*  expect(getByLabelText('Run ID')).toBeChecked();
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

  // add more tests for other columns
});
 */
});
