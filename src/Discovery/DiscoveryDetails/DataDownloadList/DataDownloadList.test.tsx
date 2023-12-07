import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DataDownloadList from './DataDownloadList';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(0),
  useLocation: jest.fn().mockReturnValue(0),
}));

describe('DataDownloadList', () => {
  it(`renders the component with titles and descriptions and action buttons container
  when sourceFieledData has titles and descriptions`, () => {
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
    const { getByText } = render(
      <DataDownloadList
        discoveryConfig={null}
        resourceInfo={null}
        sourceFieldData={sourceFieldData}
      />,
    );
    // Verify that the component renders successfully
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.title)).toBeInTheDocument();
      expect(getByText(obj.description)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('actionButtons')).toBeInTheDocument();
  });

  it('renders the component with titles and descriptions when sourceFieledData has file_names and descriptions', () => {
    const sourceFieldData = [
      [
        {
          file_name: 'File name 1',
          description: 'Description 1',
        },
        {
          file_name: 'File name 2',
          description: 'Description 2',
        },
      ],
    ];
    const { getByText } = render(
      <DataDownloadList sourceFieldData={sourceFieldData} />,
    );
    // Verify that the component renders successfully
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.file_name)).toBeInTheDocument();
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
    const { getByText } = render(
      <DataDownloadList sourceFieldData={sourceFieldData} />,
    );
    // Verify that the component renders successfully
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.title)).toBeInTheDocument();
    });
  });

  it('does not render the file list but does render the action buttons when data is missing title and file_name', () => {
    const sourceFieldData = [
      [
        {
          NotTheTitle: undefined, // No title
          NotTheFileName: '',
          description: 'Some description',
        },
      ],
    ];
    render(<DataDownloadList sourceFieldData={sourceFieldData} />);
    // Verify that the list does not render but the buttons do
    expect(
      screen.queryByTestId('dataDownloadFileList'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('actionButtons')).toBeInTheDocument();
  });
});
