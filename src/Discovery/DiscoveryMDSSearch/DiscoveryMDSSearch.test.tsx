import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscoveryMDSSearch from '.';
import { SearchMode } from '../Discovery';

describe('DiscoveryMDSSearch Component', () => {
  const mockSetSelectedSearchableTextFields = jest.fn();
  const mockHandleSearchChange = jest.fn();
  const mockSetSearchMode = jest.fn();
  const defaultProps = {
    searchableAndSelectableTextFields: {
      field1: 'value1',
      field2: 'value2',
    },
    selectedSearchableTextFields: [],
    setSelectedSearchableTextFields: mockSetSelectedSearchableTextFields,
    searchMode: SearchMode.FULL_TEXT,
    setSearchMode: mockSetSearchMode,
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

  test('toggle to restrict search mode', () => {
    render(<DiscoveryMDSSearch {...defaultProps} />);
    const radioRestrictSearch = screen.getByLabelText('Restrict Search to Selected Fields');
    // Click on the restrict search radio button
    fireEvent.click(radioRestrictSearch);
    expect(mockSetSearchMode).toHaveBeenCalledWith(SearchMode.RESTRICTED);
  });

  test('selects checkbox and updates when in restrict search mode', () => {
    const updatedProps = { ...defaultProps, searchMode: SearchMode.RESTRICTED };
    render(<DiscoveryMDSSearch {...updatedProps} />);
    // Click on the checkbox
    const checkbox = screen.getByLabelText('field1');
    fireEvent.click(checkbox);
    expect(mockSetSelectedSearchableTextFields).toHaveBeenCalledWith(['value1']);
  });
});
