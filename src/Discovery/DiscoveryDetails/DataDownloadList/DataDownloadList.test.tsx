import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import DataDownloadList from './DataDownloadList';

// Mock CheckThatDataHasTitles function
jest.mock('./CheckThatDataHasTitles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('DataDownloadList', () => {
  it('renders the component with titles and descriptions when CheckThatDataHasTitles returns true', () => {
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
      ],
    ];
    const { getByText } = render(<DataDownloadList sourceFieldData={sourceFieldData} />);
    // Verify that the component renders successfully
    expect(getByText('Data Download Links')).toBeInTheDocument();
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.title)).toBeInTheDocument();
      expect(getByText(obj.description)).toBeInTheDocument();
    });
  });

  it('renders the component when descriptions are missing', () => {
    const sourceFieldData = [
      [
        {
          title: 'Title 1',
        },
        {
          title: 'Title 2',
          description: 'Description 2',
        },
      ],
    ];
    const { getByText } = render(<DataDownloadList sourceFieldData={sourceFieldData} />);
    // Verify that the component renders successfully
    expect(getByText('Data Download Links')).toBeInTheDocument();
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.title)).toBeInTheDocument();
    });
  });

  it('does not render the component when CheckThatDataHasTitles returns false', () => {
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
      ],
    ];
    const { container } = render(<DataDownloadList sourceFieldData={sourceFieldData} />);
    // Verify that the component does not render (returns null)
    expect(container.firstChild).toBeNull();
  });
});
