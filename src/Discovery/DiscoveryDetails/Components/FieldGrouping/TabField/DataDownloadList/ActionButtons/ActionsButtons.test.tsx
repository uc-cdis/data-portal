import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestScheduler } from 'jest';
import ActionButtons from './ActionButtons';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(0),
  useLocation: jest.fn().mockReturnValue(0),
}));

describe('ActionButtons', () => {
  const mockDiscoveryConfig = {
    features: {
      authorization: {
        enabled: true,
      },
      exportToWorkspace: {
        studyMetadataFieldName: 'study_metadata',
        enableDownloadStudyMetadata: true,
        enableDownloadManifest: true,
        enableDownloadZip: true,
        variableMetadataFieldName: true,
        enableDownloadVariableMetadata: true,
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

  const mockDownloadStatus = {
    inProgress: '',
    message: { content: <React.Fragment />, active: true, title: '' },
  };

  /* Helper Functions */
  const checkResourceInfoConditional = (buttonText: string) => {
    const { queryByText } = render(
      <ActionButtons
        isUserLoggedIn
        userHasAccessToDownload
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
        userHasAccessToDownload
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
        userHasAccessToDownload
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

  const hoverOverButtonAndCheckText = async (button, popOverText, popOverShouldRender) => {
    fireEvent.mouseEnter(button);
    const popOverTextNode = screen.queryByText(popOverText);
    if (popOverShouldRender) {
      await waitFor(() => {
        expect(popOverTextNode).toBeInTheDocument();
      });
    } else {
      expect(popOverTextNode).toBeNull();
    }
  };

  const checkConditionalPopoverMissingRequiredIdentityProvidersInCommon = async (buttonTestID:string, popOverShouldRender:boolean) => {
    render(
      <ActionButtons
        isUserLoggedIn
        userHasAccessToDownload
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={['InCommon']}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const popOverText = 'This dataset is only accessible to users who have authenticated via InCommon. Please log in using the InCommon option.';
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popOverText, popOverShouldRender);
  };

  const checkConditionalPopoverMissingRequiredIdentityProvidersMultiple = async (buttonTestID: string, popOverShouldRender:boolean) => {
    const missingRequiredIdentityProviders = ['InCommon', 'Google'];
    render(
      <ActionButtons
        isUserLoggedIn
        userHasAccessToDownload
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={missingRequiredIdentityProviders}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const popOverText = `Data selection requires [${missingRequiredIdentityProviders.join(', ')}]
    credentials to access. Please change selection to only need one set of credentials
    and log in using appropriate credentials`;
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popOverText, popOverShouldRender);
  };

  const checkConditionalPopoverUserDoesNotHaveAccess = async (buttonTestID, popOverShouldRender) => {
    render(
      <ActionButtons
        isUserLoggedIn
        userHasAccessToDownload={false}
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={['InCommon']}
        noData={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const popOverText = 'You don\'t have access to this data';
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popOverText, popOverShouldRender);
  };
  const checkConditionalPopoverNoData = async (buttonTestID, popOverShouldRender) => {
    render(
      <ActionButtons
        isUserLoggedIn={false}
        userHasAccessToDownload
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        missingRequiredIdentityProviders={[]}
        noData
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        history={{}}
        location={{}}
      />,
    );
    const popOverText = 'This file is not available for the selected study';
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popOverText, popOverShouldRender);
  };

  /* Tests */
  test('Renders test id for ActionButtons', () => {
    render(
      <ActionButtons
        isUserLoggedIn
        userHasAccessToDownload
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
        userHasAccessToDownload
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

  /* Testing Conditional popover */
  const buttonIDsAndShowsPopover = [
    {
      id: 'login-to-download-manifest',
      showsPopover: true,
    },
    {
      id: 'download-study-level-metadata',
      showsPopover: false,
    },
    {
      id: 'login-to-download-all-files',
      showsPopover: true,
    },
    {
      id: 'download-variable-level-metadata',
      showsPopover: false,
    },
  ];

  buttonIDsAndShowsPopover.forEach((button) => {
    test(`Pop over ${button.showsPopover ? 'renders' : 'does not render'} when hovered over
      ${button.id} button when missing required identity providers is InCommon`, async () => {
      checkConditionalPopoverMissingRequiredIdentityProvidersInCommon(button.id, button.showsPopover);
    });
    test(`Pop over ${button.showsPopover ? 'renders' : 'does not render'} when hovered over
      ${button.id} button when missing required identity providers is multiple`, async () => {
      checkConditionalPopoverMissingRequiredIdentityProvidersMultiple(button.id, button.showsPopover);
    });
    test(`Pop over ${button.showsPopover ? 'renders' : 'does not render'} when hovered over
      ${button.id} button when User Does Not Have Access`, async () => {
      checkConditionalPopoverUserDoesNotHaveAccess(button.id, button.showsPopover);
    });

    test(`Pop over ${button.showsPopover ? 'renders' : 'does not render'} when hovered over
      ${button.id} button when study has no data`, async () => {
      checkConditionalPopoverNoData(button.id, button.showsPopover);
    });
  });
});
