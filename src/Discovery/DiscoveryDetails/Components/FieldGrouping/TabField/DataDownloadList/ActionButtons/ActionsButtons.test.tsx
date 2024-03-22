import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from './ActionButtons';
import { DiscoveryConfig } from '../../../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../../../Discovery';
import DownloadStatus from '../Interfaces/DownloadStatus';

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
        variableMetadataFieldName: 'test',
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

  const testProps = {
    isUserLoggedIn: true,
    userHasAccessToDownload: true,
    discoveryConfig: mockDiscoveryConfig as DiscoveryConfig,
    resourceInfo: mockResourceInfo as unknown as DiscoveryResource,
    missingRequiredIdentityProviders: [],
    noData: false,
    downloadStatus: mockDownloadStatus as DownloadStatus,
    setDownloadStatus: () => {},
    history: {},
    location: {},
  };

  /* Helper Functions */
  const checkResourceInfoConditional = (buttonText: string) => {
    const { queryByText } = render(
      <ActionButtons {...testProps} resourceInfo={{} as DiscoveryResource} />,
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  };

  const checkExportToWorkspaceConditional = (
    buttonText: string,
    condition: string,
  ) => {
    const { getByText, queryByText, rerender } = render(
      <ActionButtons {...testProps} />,
    );
    const targetButton = getByText(buttonText);
    expect(targetButton).toBeInTheDocument();
    // Disable the condition for rendering the button
    const changedConfig = structuredClone(mockDiscoveryConfig);
    changedConfig.features.exportToWorkspace[condition] = false;
    rerender(
      <ActionButtons
        {...testProps}
        discoveryConfig={changedConfig as DiscoveryConfig}
      />,
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  };

  const hoverOverButtonAndCheckText = async (
    button: HTMLElement,
    popoverText: string,
    popoverShouldRender: boolean,
  ) => {
    fireEvent.mouseEnter(button);
    const popoverTextNode = screen.queryByText(popoverText);
    if (popoverShouldRender) {
      await waitFor(() => {
        expect(popoverTextNode).toBeInTheDocument();
      });
    } else {
      expect(popoverTextNode).toBeNull();
    }
  };

  const checkConditionalPopoverMissingRequiredIdentityProvidersInCommon = async (buttonTestID: string, popoverShouldRender: boolean) => {
    render(
      <ActionButtons
        {...testProps}
        missingRequiredIdentityProviders={['InCommon']}
      />,
    );
    const popoverText = `This dataset is only accessible to users who have
    authenticated via InCommon. Please log in using the InCommon option.`;
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popoverText, popoverShouldRender);
  };

  const checkConditionalPopoverMissingRequiredIdentityProvidersMultiple = async (buttonTestID: string, popoverShouldRender: boolean) => {
    const missingRequiredIdentityProviders = ['InCommon', 'Google'];
    render(
      <ActionButtons
        {...testProps}
        missingRequiredIdentityProviders={missingRequiredIdentityProviders}
      />,
    );
    const popoverText = `Data selection requires [${missingRequiredIdentityProviders.join(
      ', ',
    )}]
    credentials to access. Please change selection to only need one set of credentials
    and log in using appropriate credentials`;
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popoverText, popoverShouldRender);
  };

  const checkConditionalPopoverUserDoesNotHaveAccess = async (
    buttonTestID: string,
    popoverShouldRender: boolean,
  ) => {
    render(
      <ActionButtons
        {...testProps}
        missingRequiredIdentityProviders={['InCommon']}
        userHasAccessToDownload={false}
      />,
    );
    const popoverText = 'You don\'t have access to this data';
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popoverText, popoverShouldRender);
  };
  const checkConditionalPopoverNoData = async (
    buttonTestID: string,
    popoverShouldRender: boolean,
  ) => {
    render(<ActionButtons {...testProps} isUserLoggedIn={false} noData />);
    const popoverText = 'This file is not available for the selected study';
    const button = screen.getByTestId(buttonTestID);
    hoverOverButtonAndCheckText(button, popoverText, popoverShouldRender);
  };

  /* Tests */
  test('Renders test id for ActionButtons', () => {
    render(<ActionButtons {...testProps} />);
    expect(screen.queryByTestId('actionButtons')).toBeInTheDocument();
  });
  test('ActionButtons should have "Login to" text when not logged in', () => {
    render(<ActionButtons {...testProps} isUserLoggedIn={false} />);
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
    test(`Popover ${
      button.showsPopover ? 'renders' : 'does not render'
    } when hovered over
      ${
  button.id
} button when missing required identity providers is InCommon`, async () => {
      checkConditionalPopoverMissingRequiredIdentityProvidersInCommon(
        button.id,
        button.showsPopover,
      );
    });
    test(`Popover ${
      button.showsPopover ? 'renders' : 'does not render'
    } when hovered over
      ${
  button.id
} button when missing required identity providers is multiple`, async () => {
      checkConditionalPopoverMissingRequiredIdentityProvidersMultiple(
        button.id,
        button.showsPopover,
      );
    });
    test(`Popover ${
      button.showsPopover ? 'renders' : 'does not render'
    } when hovered over
      ${button.id} button when user does not have access`, async () => {
      checkConditionalPopoverUserDoesNotHaveAccess(
        button.id,
        button.showsPopover,
      );
    });

    test(`Popover ${
      button.showsPopover ? 'renders' : 'does not render'
    } when hovered over
      ${button.id} button when study has no data`, async () => {
      checkConditionalPopoverNoData(button.id, button.showsPopover);
    });
  });
});
