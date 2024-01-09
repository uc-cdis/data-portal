import HandleDownloadManifestClick from './HandleDownloadManifestClick';
import DownloadJsonFile from './DownloadJsonFile';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';

// Mock the DownloadJsonFile module
jest.mock('./DownloadJsonFile');

describe('HandleDownloadManifestClick', () => {
  it('should not call DownloadJsonFile when healIDPLoginNeeded is true', () => {
    // Mock data
    const config = {
      features: {
        exportToWorkspace: {
          manifestFieldName: 'manifestFieldName',
        },
      },
    } as DiscoveryConfig;
    const selectedResources = [{ manifestFieldName: [{ item: 'value' }] }];
    const healIDPLoginNeeded = true;

    // Call the function
    HandleDownloadManifestClick(config, selectedResources, healIDPLoginNeeded);

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
    const healIDPLoginNeeded = false;

    // Assertions
    expect(() => HandleDownloadManifestClick(config, selectedResources, healIDPLoginNeeded),
    ).toThrowError(
      'Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`',
    );
  });
  it('should call DownloadJsonFile with the correct arguments when healICPSRLoginNeeded is false', () => {
    // Mock data
    const config = {
      features: {
        exportToWorkspace: {
          manifestFieldName: 'manifestFieldName',
        },
      },
    } as DiscoveryConfig;
    const selectedResources = [{ manifestFieldName: [{ item: 'value' }] }];
    const healIDPLoginNeeded = false;

    // Call the function
    HandleDownloadManifestClick(config, selectedResources, healIDPLoginNeeded);

    // Assertions
    expect(DownloadJsonFile).toHaveBeenCalledWith('manifest', [
      { item: 'value' },
    ]);
  });
});
