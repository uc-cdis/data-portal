import HandleDownloadManifestClick from './HandleDownloadManifestClick';
import DownloadJsonFile from './DownloadJsonFile';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';

// Mock the DownloadJsonFile module
jest.mock('./DownloadJsonFile');

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
    const selectedResources = [{ manifestFieldName: [{ item: 'value' }] }];
    const missingRequiredIdentityProviders = ['InCommon'];

    // Call the function
    HandleDownloadManifestClick(config, selectedResources, missingRequiredIdentityProviders);

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
    const selectedResources = [{ manifestFieldName: [{ item: 'value' }] }];
    const missingRequiredIdentityProviders = [];

    // Assertions
    expect(() => HandleDownloadManifestClick(config, selectedResources, missingRequiredIdentityProviders),
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
    const selectedResources = [{ manifestFieldName: [{ item: 'value' }] }];
    const missingRequiredIdentityProviders = [];

    // Call the function
    HandleDownloadManifestClick(config, selectedResources, missingRequiredIdentityProviders);

    // Assertions
    expect(DownloadJsonFile).toHaveBeenCalledWith('manifest', [
      { item: 'value' },
    ]);
  });
});
