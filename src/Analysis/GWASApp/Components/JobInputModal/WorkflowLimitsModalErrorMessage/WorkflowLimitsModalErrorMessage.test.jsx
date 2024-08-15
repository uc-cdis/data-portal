import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkflowLimitsModalErrorMessage from './WorkflowLimitsModalErrorMessage';
import { components } from '../../../../../params';
import {
  workflowLimitsInvalidDataMessage,
  workflowLimitsLoadingErrorMessage,
} from '../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';

describe('WorkflowLimitsModalErrorMessage', () => {
  const defaultProps = {
    status: 'error',
    workflowLimitInfoIsValid: true,
    workFlowLimitExceeded: false,
  };

  test('renders error message when status is "error"', () => {
    render(<WorkflowLimitsModalErrorMessage {...defaultProps} />);
    expect(
      screen.getByText(workflowLimitsLoadingErrorMessage),
    ).toBeInTheDocument();
  });

  test('renders invalid data message when status is "success" and workflowLimitInfoIsValid is false', () => {
    render(
      <WorkflowLimitsModalErrorMessage
        {...defaultProps}
        status='success'
        workflowLimitInfoIsValid={false}
      />,
    );
    expect(
      screen.getByText(workflowLimitsInvalidDataMessage),
    ).toBeInTheDocument();
  });

  test(`renders limit reached message when status is "success",
    workflowLimitInfoIsValid is true, and workFlowLimitExceeded is true`, async () => {
    const supportEmail = components.login?.email || 'support@datacommons.io';
    render(
      <WorkflowLimitsModalErrorMessage
        {...defaultProps}
        status='success'
        workflowLimitInfoIsValid
        workFlowLimitExceeded
      />,
    );

    expect(
      await screen.findByText(
        /Workflow limit reached\. Please contact support for assistance:/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(supportEmail)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: supportEmail })).toHaveAttribute(
      'href',
      `mailto:${supportEmail}`,
    );
  });

  test(`renders nothing when status is success, workflowLimitInfoIsValid
    and the limit is not exceeded`, () => {
    render(
      <WorkflowLimitsModalErrorMessage
        {...defaultProps}
        status='success'
        workflowLimitInfoIsValid
        workFlowLimitExceeded={false}
      />,
    );

    expect(
      screen.queryByText(workflowLimitsLoadingErrorMessage),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(workflowLimitsInvalidDataMessage),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Workflow limit reached. Please contact support for assistance:',
      ),
    ).not.toBeInTheDocument();
  });
});
