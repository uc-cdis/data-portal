import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionsDropdown from './ActionsDropdown';

const record = { name: 'name', uid: 'uid' };
describe('ActionsDropdown', () => {
  it('should open the dropdown menu when the button is clicked', () => {
    const { getByRole, getByText } = render(
      <ActionsDropdown record={record} />,
    );
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
  });
});
