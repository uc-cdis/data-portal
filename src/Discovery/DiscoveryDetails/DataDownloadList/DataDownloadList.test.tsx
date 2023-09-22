import React from 'react';
import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import DataDownloadList from './DataDownloadList';

// Mock CheckThatDataHasTitles function
jest.mock('./CheckThatDataHasTitles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('DataDownloadList', () => {
  it('renders the component when CheckThatDataHasTitles returns true', () => {
    // Mock CheckThatDataHasTitles to return true
    require('./CheckThatDataHasTitles').default.mockReturnValue(true);
    const sourceFieldData = [
      [
        {
          title: 'Title 1',
          description: 'Description 1',
        },
        {
          title: 'Title 2',
          description: 'Description 2',
        },
      ]
    ];

    const { getByText } = render(<DataDownloadList sourceFieldData={sourceFieldData} />);

    // Verify that the component renders successfully
    expect(getByText('Data Download Links')).toBeInTheDocument();
  });

  it('does not render the component when CheckThatDataHasTitles returns false', () => {
    // Mock CheckThatDataHasTitles to return false
    require('./CheckThatDataHasTitles').default.mockReturnValue(false);

    const sourceFieldData = [
      [
        {
          title: undefined, // No title
          description: 'Description 1',
        },
        {
          title: 'Title 2',
          description: 'Description 2',
        },
      ]
    ];

    const { container } = render(<DataDownloadList sourceFieldData={sourceFieldData} />);
    // Verify that the component does not render (returns null)
    expect(container.firstChild).toBeNull();
  });
});
