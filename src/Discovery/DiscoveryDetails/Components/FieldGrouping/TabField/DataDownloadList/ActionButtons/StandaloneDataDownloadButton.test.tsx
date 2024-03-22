import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StandaloneDataDownloadButton from './StandaloneDataDownloadButton';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(0),
  useLocation: jest.fn().mockReturnValue(0),
}));

const LocalConfMock = jest.requireMock('../../../../../../../localconf');
jest.mock('../../../../../../../localconf', () => ({
  bundle: 'commons',
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('StandaloneDataDownloadButton', () => {
  const mockDiscoveryConfig = {
    features: {
      authorization: {
        enabled: true,
      },
      exportToWorkspace: {
        manifestFieldName: '__manifest',
        enableDownloadZip: false,
      },
    },
    minimalFieldMapping: {
      uid: 'study_id',
    },
  };

  const mockResourceInfo = {
    study_id: 'mockStudyId',
    __manifest: [{ title: 'mockFileTitle', object_id: 'mockGUID' }],
  };

  const mockDataDownloadListItem = {
    title: 'mockFileTitle', guid: 'mockGUID',
  };

  const mockDownloadStatus = {
    inProgress: '',
    message: {},
  };

  /* Tests */
  test('StandaloneDataDownloadButton not render if there is no item', () => {
    const { container } = render(
      <StandaloneDataDownloadButton
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        noData
        isUserLoggedIn={false}
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={{}}
      />,
    );
    expect(container.childElementCount).toEqual(0);
  });

  test('StandaloneDataDownloadButton should have "Login to" text when not logged in', () => {
    render(
      <StandaloneDataDownloadButton
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn={false}
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    const loginText = screen.getAllByText(/Login to/i);
    expect(loginText[0]).toBeInTheDocument();
  });

  test('renders StandaloneDataDownloadButton for Gen3 Commons', () => {
    // regular download button for Gen3 commons, base case
    const { rerender } = render(
      <StandaloneDataDownloadButton
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    expect(screen.queryByTestId('standaloneDataDownloadButton-commons-regular-download')).toBeInTheDocument();
    // regular download button for Gen3 commons, even if enableDownloadZip is on
    const changedConfig = structuredClone(mockDiscoveryConfig);
    changedConfig.features.exportToWorkspace.enableDownloadZip = true;
    rerender(
      <StandaloneDataDownloadButton
        discoveryConfig={changedConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    expect(screen.queryByTestId('standaloneDataDownloadButton-commons-regular-download')).toBeInTheDocument();
  });

  test('renders StandaloneDataDownloadButton for Gen3 Ecosystem', () => {
    // regular download button for Gen3 ecosystem, base case
    LocalConfMock.bundle = 'ecosystem';
    render(
      <StandaloneDataDownloadButton
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    expect(screen.queryByTestId('standaloneDataDownloadButton-commons-regular-download')).toBeInTheDocument();
    // batch export based download button for Gen3 ecosystem, all conditions are met
    const changedConfig = structuredClone(mockDiscoveryConfig);
    changedConfig.features.exportToWorkspace.enableDownloadZip = true;
    render(
      <StandaloneDataDownloadButton
        discoveryConfig={changedConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn
        userHasAccessToDownload
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    expect(screen.queryByTestId('standaloneDataDownloadButton-ecosystem-batch-export')).toBeInTheDocument();
  });

  test('StandaloneDataDownloadButton is disabled if user doesn\'t have access to download', () => {
    // regular download button for Gen3 commons, base case
    render(
      <StandaloneDataDownloadButton
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        noData={false}
        isUserLoggedIn
        userHasAccessToDownload={false}
        downloadStatus={mockDownloadStatus}
        setDownloadStatus={() => {}}
        missingRequiredIdentityProviders={[]}
        item={mockDataDownloadListItem}
      />,
    );
    expect(screen.queryByTestId('standaloneDataDownloadButton-commons-regular-download')).toHaveClass('ant-btn-disabled');
  });
});
