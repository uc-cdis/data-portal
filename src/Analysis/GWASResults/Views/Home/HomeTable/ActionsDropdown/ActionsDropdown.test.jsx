import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionsDropdown from './ActionsDropdown';
import PHASES from '../../../../Utils/PhasesEnumeration';
import * as WorkflowUtils from '../../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';
import * as gwasWorkflowApi from '../../../../Utils/gwasWorkflowApi';

jest.mock(
  '../../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils',
  () => ({
    fetchMonthlyWorkflowLimitInfo: jest.fn(),
    workflowLimitInfoIsValid: jest.fn(),
    workflowLimitsInvalidDataMessage: 'Invalid data message',
    workflowLimitsLoadingErrorMessage: 'Loading error message',
  }),
);

jest.mock('../../../../Utils/gwasWorkflowApi', () => ({
  fetchPresignedUrlForWorkflowArtifact: jest.fn(),
  retryWorkflow: jest.fn(),
}));

const mockFetchMonthlyWorkflowLimitInfo = WorkflowUtils.fetchMonthlyWorkflowLimitInfo;
const mockWorkflowLimitInfoIsValid = WorkflowUtils.workflowLimitInfoIsValid;
const mockRetryWorkflow = gwasWorkflowApi.retryWorkflow;

const mockRecord = {
  name: 'testWorkflow',
  uid: '12345',
  phase: PHASES.Succeeded,
};

describe('ActionsDropdown', () => {
  beforeEach(() => {
    // Mock console.error to suppress error messages
    console.error = jest.fn();
  });

  it('should open the dropdown menu when the button is clicked and Retry option should be disabled for the Phase "running"', () => {
    const record = { phase: PHASES.Running };
    const { getByRole, getByText } = render(
      <ActionsDropdown record={record} />,
    );
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Retry').parentElement.parentElement).toHaveClass(
      'ant-dropdown-menu-item-disabled',
    );
  });
  it('should open the dropdown menu when the button is clicked and Retry option should be enabled for the Phase "failed"', () => {
    const record = { phase: PHASES.Failed };
    const { getByRole, getByText } = render(
      <ActionsDropdown record={record} />,
    );
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Retry').parentElement.parentElement).not.toHaveClass(
      'ant-dropdown-menu-item-disabled',
    );
  });

  it('should disabled Download option for the Phase "failed"', () => {
    const record = { phase: PHASES.Failed };
    const { getByRole, getByText } = render(
      <ActionsDropdown record={record} />,
    );
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Download').parentElement.parentElement).toHaveClass(
      'ant-dropdown-menu-item-disabled',
    );
  });
  it('should enabled Download option for the Phase "Succeeded"', () => {
    const record = { phase: PHASES.Succeeded };
    const { getByRole, getByText } = render(
      <ActionsDropdown record={record} />,
    );
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Download').parentElement.parentElement).not.toHaveClass(
      'ant-dropdown-menu-item-disabled',
    );
  });

  // Tests for Retry Event

  it('handles the Retry click event correctly when workflow limit is valid', async () => {
    mockFetchMonthlyWorkflowLimitInfo.mockResolvedValue({
      workflow_run: 0,
      workflow_limit: 50,
    });

    mockWorkflowLimitInfoIsValid.mockReturnValue(true);
    mockRetryWorkflow.mockResolvedValue();

    const { getByRole, getByText } = render(
      <ActionsDropdown record={mockRecord} />,
    );

    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });

    const retryLink = getByText(/Retry/i);
    waitFor(() => {
      fireEvent.click(retryLink);
    });
    await waitFor(() => {
      expect(mockFetchMonthlyWorkflowLimitInfo).toHaveBeenCalled();
      expect(mockRetryWorkflow).toHaveBeenCalledWith(
        mockRecord.name,
        mockRecord.uid,
      );
    });
  });

  it('displays error notification when workflow limit fetch fails', async () => {
    mockFetchMonthlyWorkflowLimitInfo.mockRejectedValue(
      new Error('Fetch error'),
    );

    const { getByRole, getByText } = render(
      <ActionsDropdown record={mockRecord} />,
    );

    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });

    const retryLink = getByText(/Retry/i);
    fireEvent.click(retryLink);

    await waitFor(() => {
      expect(getByText(/Loading error message/i)).toBeInTheDocument();
    });
  });

  it('displays error notification when retry workflow fails', async () => {
    mockFetchMonthlyWorkflowLimitInfo.mockResolvedValue({
      workflow_run: 0,
      workflow_limit: 10,
    });
    mockWorkflowLimitInfoIsValid.mockReturnValue(true);
    mockRetryWorkflow.mockRejectedValue(new Error('Retry error'));

    const { getByRole, getByText } = render(
      <ActionsDropdown record={mockRecord} />,
    );

    const dropdownButton = getByRole('button', { name: /ellipsis/i });
    fireEvent.click(dropdownButton);

    const retryLink = getByText(/Retry/i);
    fireEvent.click(retryLink);

    await waitFor(() => {
      expect(getByText(/Retry request failed./i)).toBeInTheDocument();
    });
  });
});
