import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBarMessage from './SearchBarMessage';
import { IColumnManagementData } from '../../../Interfaces/Interfaces';

// Mocking showSearchBarMessage function
jest.mock('./showSearchBarMessage', () => jest.fn());

describe('SearchBarMessage component', () => {
  const columnManagementResetMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render null if showSearchBarMessage returns false', () => {
    // Mocking showSearchBarMessage to return false
    require('./showSearchBarMessage').default.mockReturnValue(false);

    const { container } = render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm=''
        paginatedData={[]}
        columnManagementData={{} as IColumnManagementData}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render message and button if showSearchBarMessage returns true', () => {
    // Mocking showSearchBarMessage to return true
    require('./showSearchBarMessage').default.mockReturnValue(true);

    const { getByText, getByTestId } = render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm="test"
        paginatedData={[{ id: 1, name: 'Test' }]}
        columnManagementData={{ visibleColumns: [], hiddenColumns: [] }}
      />
    );

    expect(getByText(/Matches found in hidden columns/i)).toBeInTheDocument();
    expect(getByTestId('eye-icon')).toBeInTheDocument();

    fireEvent.click(getByText(/Show all/i));
    expect(columnManagementResetMock).toHaveBeenCalled();
  });
});
