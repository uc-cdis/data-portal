import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBarMessage from './SearchBarMessage';
import showSearchBarMessage from './showSearchBarMessage';
import DefaultAtlasColumnManagement from '../../../Utils/DefaultAtlasColumnManagement';
import TableData from '../../../TestData/TableData';
import { IColumnManagementData, IRowData } from '../../../Interfaces/Interfaces';

jest.mock('./showSearchBarMessage');
const columnManagementResetMock = jest.fn();
const searchTerm = 'search term';
const paginatedData = TableData.data as IRowData[];
const columnManagementData = { DefaultAtlasColumnManagement };

describe('SearchBarMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders message when showSearchBarMessage returns true', () => {
    // Mock showSearchBarMessage to return true to force component to show
    showSearchBarMessage.mockReturnValue(true);

    render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm={searchTerm}
        paginatedData={paginatedData}
        columnManagementData={columnManagementData as unknown as IColumnManagementData}
      />,
    );

    expect(screen.getByText('Matches found in hidden columns.')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('show-all-button'));
    expect(columnManagementResetMock).toHaveBeenCalled();
  });

  it('does not render message when showSearchBarMessage returns false', () => {
    // Mock showSearchBarMessage to return false
    showSearchBarMessage.mockReturnValue(false);

    const { container } = render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm={searchTerm}
        paginatedData={paginatedData}
        columnManagementData={columnManagementData as unknown as IColumnManagementData}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
