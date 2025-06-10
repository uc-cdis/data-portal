import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscoveryMDSSearch from '.';

describe('DiscoveryMDSSearch Component', () => {
  const mockSetSelectedSearchableTextFields = jest.fn();
  const mockHandleSearchChange = jest.fn();
  const defaultProps = {
    searchableAndSelectableTextFields: {
      field1: 'value1',
      field2: 'value2',
    },
    selectedSearchableTextFields: [],
    setSelectedSearchableTextFields: mockSetSelectedSearchableTextFields,
    searchTerm: '',
    handleSearchChange: mockHandleSearchChange,
    inputSubtitle: 'Subtitle',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and subtitle', () => {
    render(<DiscoveryMDSSearch {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search studies by keyword...')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  test('changes search term on input change', () => {
    render(<DiscoveryMDSSearch {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search studies by keyword...');
    fireEvent.change(input, { target: { value: 'new search term' } });
    expect(mockHandleSearchChange).toHaveBeenCalled();
  });

  test('selects checkbox and updates when in restrict search mode', () => {
    render(<DiscoveryMDSSearch {...defaultProps} />);
    const radioRestrictSearch = screen.getByLabelText('Restrict Search to Selected Fields');
    // Click on the restrict search radio button
    fireEvent.click(radioRestrictSearch);
    // Click on the checkbox
    const checkbox = screen.getByLabelText('field1');
    fireEvent.click(checkbox);
    expect(mockSetSelectedSearchableTextFields).toHaveBeenCalledWith(['value1']);
  });

  test('changes radio button and clears selected fields', () => {
    render(<DiscoveryMDSSearch {...defaultProps} />);
    const radioFullText = screen.getByLabelText('Full Text Search');
    const radioRestrictSearch = screen.getByLabelText('Restrict Search to Selected Fields');
    // Click on the restrict search radio button
    fireEvent.click(radioRestrictSearch);
    expect(mockSetSelectedSearchableTextFields).not.toHaveBeenCalled();
    // Click on the full text search radio button
    fireEvent.click(radioFullText);
    expect(mockSetSelectedSearchableTextFields).toHaveBeenCalledWith([]);
  });
});
