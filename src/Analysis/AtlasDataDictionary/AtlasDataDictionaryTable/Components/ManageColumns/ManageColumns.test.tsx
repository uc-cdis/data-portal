import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DefaultAtlasColumnManagement from '../../Utils/DefaultAtlasColumnManagement';
import ManageColumns from './ManageColumns';

describe('ManageColumns component', () => {
  const handleTableChangeMock = jest.fn();

  it('renders manage columns button', () => {
    const { getByText } = render(
      <ManageColumns
        handleTableChange={handleTableChangeMock}
        columnManagementData={DefaultAtlasColumnManagement}
      />,
    );
    const manageColumnsButton = getByText('Manage Columns');
    expect(manageColumnsButton).toBeInTheDocument();
  });

  it('shows popover after clicking on manage columns button to restore defaults', () => {
    const { getByText, getByRole } = render(
      <ManageColumns
        handleTableChange={handleTableChangeMock}
        columnManagementData={DefaultAtlasColumnManagement}
      />,
    );
    const manageColumnsButton = getByText('Manage Columns');
    fireEvent.click(manageColumnsButton);
    const popover = getByRole('dialog');
    expect(popover).toBeInTheDocument();
  });

  it('Calls reset function after clicking on restore defaults button', async () => {
    const { getByText } = render(
      <ManageColumns
        handleTableChange={handleTableChangeMock}
        columnManagementData={DefaultAtlasColumnManagement}
      />,
    );
    const manageColumnsButton = getByText('Manage Columns');
    fireEvent.click(manageColumnsButton);
    const restoreDefaultsButton = getByText('Restore Defaults');
    fireEvent.click(restoreDefaultsButton);

    expect(handleTableChangeMock).toHaveBeenCalledWith(
      'columnManagementReset',
      'columnManagementReset',
    );
  });

  it('Calls columnManagementUpdateOne after clicking on a column control button', async () => {
    const { getByText } = render(
      <ManageColumns
        handleTableChange={handleTableChangeMock}
        columnManagementData={DefaultAtlasColumnManagement}
      />,
    );
    const manageColumnsButton = getByText('Manage Columns');
    fireEvent.click(manageColumnsButton);
    const conceptIDControlButton = getByText('Concept ID');
    fireEvent.click(conceptIDControlButton);
    expect(handleTableChangeMock).toHaveBeenCalledWith(
      'columnManagementUpdateOne',
      'conceptID',
    );
  });
});
