import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Tab } from '@mantine/core/lib/Tabs/Tab/Tab';
import SearchBarMessage from './SearchBarMessage';
import { IColumnManagementData } from '../../../Interfaces/Interfaces';
import TableData from '../../../TestData/TableData';
import DefaultAtlasColumnManagement from '../../../Utils/DefaultAtlasColumnManagement';

// Mocking showSearchBarMessage function
jest.mock('./showSearchBarMessage', () => jest.fn());

const paginatedData = [{
  ...TableData.data[0],
  ...{
    rowID: 1,
    numberOfPeopleWithVariablePercent: 33,
    numberOfPeopleWhereValueIsFilledPercent: 33,
    numberOfPeopleWhereValueIsNullPercent: 0,
  },
}];

describe('SearchBarMessage component', () => {
  const columnManagementResetMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render null if showSearchBarMessage returns false', () => {
    // Mocking showSearchBarMessage to return false
    // require('./showSearchBarMessage').default.mockReturnValue(false);

    const { container } = render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm=''
        paginatedData={TableData.data}
        columnManagementData={{} as IColumnManagementData}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render message and button if searchTerm value is excluded by columnManagementData', () => {
    render(
      <SearchBarMessage
        columnManagementReset={columnManagementResetMock}
        searchTerm={'Person'}
        paginatedData={paginatedData}
        columnManagementData={{ ...DefaultAtlasColumnManagement, vocabularyID: false }}
      />,
    );
    expect(screen.getByText(/Matches found in hidden columns./i)).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Show all/i));
    expect(columnManagementResetMock).toHaveBeenCalled();
  });
});
