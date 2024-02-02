import DownloadDataDictionaryInfo from './DownloadDataDictionaryInfo';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../Discovery';

import { act } from 'react-dom/test-utils';
import { mdsURL } from '../../../../../localconf';
import { fetchWithCreds } from '../../../../../actions';

jest.mock('../../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));

const mockSetDownloadStatus = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('DownloadDataDictionaryInfo', () => {
  it('should set download data dictionary info when called with invalid status number', async () => {
    const mockDataDictionaries = {
      'QA_minimal_json_20230817.json': 'f79114a6-93bd-4970-b096-7b47aa6c16fa',
    };
    const mockStatusResponse = {
      status: 500,
      data: {
        data_dictionaries: mockDataDictionaries,
      },
    };
    const discoveryConfig = {
      features: {
        exportToWorkspace: { variableMetadataFieldName: 'data_dictionaries' },
      },
    } as DiscoveryConfig;
    const resourceInfo = { _hdp_uid: 'testUID' };
    const showDownloadVariableMetadataButton = true;

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadDataDictionaryInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled();
  });

  it('should not download data dictionary info when called with invalid data', async () => {
    const mockDataDictionaries = {
      'QA_minimal_json_20230817.json': null,
    };
    const mockStatusResponse = {
      status: 500,
      data: {
        data_dictionaries: mockDataDictionaries,
      },
    };
    const discoveryConfig = {
      features: {
        exportToWorkspace: { variableMetadataFieldName: 'data_dictionaries' },
      },
    } as DiscoveryConfig;
    const resourceInfo = { _hdp_uid: 'testUID' };
    const showDownloadVariableMetadataButton = true;

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadDataDictionaryInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled();
  });

  it('should set data dictionary info when called with valid params', async () => {
    const mockDataDictionaries = {
      'QA_minimal_json_20230817.json': 'f79114a6-93bd-4970-b096-7b47aa6c16fa',
    };
    const mockStatusResponse = {
      status: 200,
      data: {
        data_dictionaries: mockDataDictionaries,
      },
    };
    const discoveryConfig = {
      features: {
        exportToWorkspace: { variableMetadataFieldName: 'data_dictionaries' },
      },
    } as DiscoveryConfig;
    const resourceInfo = { _hdp_uid: 'testUID' };
    const showDownloadVariableMetadataButton = true;

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadDataDictionaryInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).toHaveBeenCalledWith({
      noVariableLevelMetadata: false,
      dataDictionaries: mockDataDictionaries,
    });
  });
});
