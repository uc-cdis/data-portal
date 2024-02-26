import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DataDownloadList from './DataDownloadList';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import { DiscoveryResource } from '../../Discovery';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(0),
  useLocation: jest.fn().mockReturnValue(0),
}));

const testDiscoveryConfig = {
  features: {
    exportToWorkspace: {
      variableMetadataFieldName: 'variableMetadataFieldName',
      enableDownloadVariableMetadata: true,
    },
  },
  minimalFieldMapping: {
    uid: 'study_id',
  },
};

const testResourceInfo = { _hdp_uid: 'test_hdp_uid' };

describe('DataDownloadList', () => {
  it(`renders the component with titles and descriptions and action buttons container
  when sourceFieldData has titles and descriptions`, () => {
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
        resourceFieldValueIsValid
        isUserLoggedIn
        discoveryConfig={testDiscoveryConfig as unknown as DiscoveryConfig}
        resourceInfo={testResourceInfo as unknown as DiscoveryResource}
        sourceFieldData={sourceFieldData}
        healLoginNeeded={[]}
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
      <DataDownloadList
        resourceFieldValueIsValid
        isUserLoggedIn
        discoveryConfig={testDiscoveryConfig as DiscoveryConfig}
        sourceFieldData={sourceFieldData}
        resourceInfo={testResourceInfo as unknown as DiscoveryResource}
        healLoginNeeded={[]}
      />,
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
      <DataDownloadList
        resourceFieldValueIsValid
        isUserLoggedIn
        discoveryConfig={testDiscoveryConfig as DiscoveryConfig}
        resourceInfo={testResourceInfo as unknown as DiscoveryResource}
        sourceFieldData={sourceFieldData}
        healLoginNeeded={[]}
      />,
    );
    // Verify that the component renders successfully
    sourceFieldData[0].forEach((obj) => {
      expect(getByText(obj.title)).toBeInTheDocument();
    });
  });

  it(`does not render the file list but does render the action buttons
    when isResourceFieldValueValid is false`, () => {
    const sourceFieldData = [
      [
        {
          NotTheTitle: 'some title',
          NotTheFileName: '',
          description: 'Some description',
        },
      ],
    ];
    render(
      <DataDownloadList
        resourceFieldValueIsValid={false}
        isUserLoggedIn
        discoveryConfig={testDiscoveryConfig as DiscoveryConfig}
        resourceInfo={testResourceInfo as unknown as DiscoveryResource}
        sourceFieldData={sourceFieldData}
        healLoginNeeded={[]}
      />,
    );
    // Verify that the list does not render but the buttons do
    expect(
      screen.queryByTestId('dataDownloadFileList'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('actionButtons')).toBeInTheDocument();
  });
});
