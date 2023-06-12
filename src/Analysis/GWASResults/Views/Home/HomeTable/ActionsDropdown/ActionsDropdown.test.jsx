import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionsDropdown from './ActionsDropdown';
import PHASES from '../../../../Utils/PhasesEnumeration';

const record = { name: 'name', uid: 'uid' };
describe('ActionsDropdown', () => {
  it('should open the dropdown menu when the button is clicked and Retry option should be disabled for the Phase "running"', () => {
    const record = {phase: PHASES.Running};
    const { getByRole, getByText } = render(<ActionsDropdown record={record}/>);
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Retry').parentElement.parentElement).toHaveClass('ant-dropdown-menu-item-disabled');
  });
  it('should open the dropdown menu when the button is clicked and Retry option should be enabled for the Phase "failed"', () => {
    const record = {phase: PHASES.Failed};
    const { getByRole, getByText } = render(<ActionsDropdown record={record}/>);
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
    expect(getByText('Retry').parentElement.parentElement).not.toHaveClass('ant-dropdown-menu-item-disabled');
  });
});
