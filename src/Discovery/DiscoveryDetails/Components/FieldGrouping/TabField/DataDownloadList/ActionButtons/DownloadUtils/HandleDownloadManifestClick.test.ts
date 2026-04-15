import HandleDownloadManifestClick from './HandleDownloadManifestClick';
import DownloadJsonFile from './DownloadJsonFile';
import { DiscoveryConfig } from '../../../../../../../DiscoveryConfig';
import GenerateFilename from './GenerateFilename';

// Mock the DownloadJsonFile module
jest.mock('./DownloadJsonFile');

// Mock GenerateFilename()
jest.mock('moment', () => () => ({ format: () => '2026-04-15' }));
jest.mock('../../../../../../../../localconf', () => ({
  hostname: 'localhost',
  hostnameWithSubdomain: 'data-portal',
}));

// Mock RUN events
jest.mock('@datadog/browser-rum', () => ({
  datadogRum: {
    addAction: jest.fn(),
  },
}));

jest.mock('@grafana/faro-core', () => ({
  faro: {
    api: {
      pushEvent: jest.fn(),
    },
  },
}));

describe('HandleDownloadManifestClick', () => {
  it('should not call DownloadJsonFile when missingRequiredIdentityProviders has IDP names', () => {
    // Mock data
    const config = {
      features: {
        exportToWorkspace: {
          manifestFieldName: 'manifestFieldName',
        },
      },
    } as DiscoveryConfig;
    const selectedResource = { manifestFieldName: [{ item: 'value' }] };
    const missingRequiredIdentityProviders = ['InCommon'];

    // Call the function
    HandleDownloadManifestClick(config, selectedResource, missingRequiredIdentityProviders);

    // Assertions
    expect(DownloadJsonFile).not.toHaveBeenCalled();
  });

  it('should throw an error when manifestFieldName is missing in the configuration', () => {
    // Mock data
    const config = {
      features: {
        exportToWorkspace: {},
      },
    } as DiscoveryConfig;
    const selectedResource = { manifestFieldName: [{ item: 'value' }] };
    const missingRequiredIdentityProviders = [];

    // Assertions
    expect(() => HandleDownloadManifestClick(config, selectedResource, missingRequiredIdentityProviders),
    ).toThrowError(
      'Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`',
    );
  });
  it('should call DownloadJsonFile with the correct arguments when missingRequiredIdentityProviders is empty', () => {
    // Mock data
    const config = {
      features: {
        exportToWorkspace: {
          manifestFieldName: 'manifestFieldName',
        },
      },
    } as DiscoveryConfig;
    const selectedResource = { manifestFieldName: [{ item: 'value' }] };
    const missingRequiredIdentityProviders = [];

    // Call the function
    HandleDownloadManifestClick(config, selectedResource, missingRequiredIdentityProviders);
    const filename = GenerateFilename('manifest');
    // Assertions
    expect(DownloadJsonFile).toHaveBeenCalledWith(filename, [
      { item: 'value' },
    ]);
  });
});
