import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionsDropdown from './ActionsDropdown';

describe('ActionsDropdown', () => {
  it('should open the dropdown menu when the button is clicked', () => {
    const { getByRole, getByText } = render(<ActionsDropdown />);
    const dropdownButton = getByRole('button');
    waitFor(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Download')).toBeInTheDocument();
  });
});
