import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from './ActionButtons';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(0),
  useLocation: jest.fn().mockReturnValue(0),
}));

describe('ActionButtons', () => {
  const mockDiscoveryConfig = {
    features: {
      exportToWorkspace: {
        studyMetadataFieldName: 'study_metadata',
        enableDownloadStudyMetadata: true,
        enableDownloadManifest: true,
        enableDownloadZip: true,
      },
    },
    minimalFieldMapping: {
      uid: 'study_id',
    },
  };

  const mockResourceInfo = {
    study_id: 'mockStudyId',
    study_metadata: true,
  };

  const mockData = {
    /* mock data */
  };

  const mockDownloadStatus = {
    inProgress: '',
    message: {},
  };

  /* Helper Functions */
  const checkResourceInfoConditional = (buttonText: string) => {
    const { queryByText } = render(
      <ActionButtons
        isUserLoggedIn
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={{}}
        missingRequiredIdentityProviders={[]}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  };

  const checkExportToWorkspaceConditional = (
    buttonText: string,
    condition: string,
  ) => {
    const { getByText, queryByText, rerender } = render(
      <ActionButtons
        isUserLoggedIn
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={[]}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const targetButton = getByText(buttonText);
    expect(targetButton).toBeInTheDocument();
    // Disable the condition for rendering the button
    const changedConfig = structuredClone(mockDiscoveryConfig);
    changedConfig.features.exportToWorkspace[condition] = false;
    rerender(
      <ActionButtons
        isUserLoggedIn
        discoveryConfig={changedConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={[]}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  };

  /* Tests */
  test('Renders test id for ActionButtons', () => {
    render(
      <ActionButtons
        isUserLoggedIn
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={[]}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    expect(screen.queryByTestId('actionButtons')).toBeInTheDocument();
  });

  test('ActionButtons should have "Login to" text when not logged in', () => {
    render(
      <ActionButtons
        isUserLoggedIn={false}
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={[]}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const loginText = screen.getAllByText(/Login to/i);
    expect(loginText[0]).toBeInTheDocument();
    expect(loginText[1]).toBeInTheDocument();
  });

  test('renders Download Study-Level Metadata button based on conditionals', () => {
    const buttonText = 'Study-Level Metadata';
    checkExportToWorkspaceConditional(
      buttonText,
      'enableDownloadStudyMetadata',
    );
    checkExportToWorkspaceConditional(buttonText, 'studyMetadataFieldName');
    checkResourceInfoConditional(buttonText);
  });
  test('renders Download Manifest button based on conditionals', () => {
    checkExportToWorkspaceConditional(
      'Download Manifest',
      'enableDownloadManifest',
    );
  });
  test('renders Download All Files button based on conditionals', () => {
    checkExportToWorkspaceConditional(
      'Download All Files',
      'enableDownloadZip',
    );
  });
});
