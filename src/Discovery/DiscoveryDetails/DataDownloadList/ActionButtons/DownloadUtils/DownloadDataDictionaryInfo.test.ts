import DownloadDataDictionaryInfo from './DownloadDataDictionaryInfo';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../Discovery';

import { act } from 'react-dom/test-utils';
import { mdsURL } from '../../../../../localconf';
import { fetchWithCreds } from '../../../../../actions';

jest.mock('../../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));

const mockResourceInfo = {
  _hdp_uid: 'HDP00001',
  project_title: 'Sample Project',
};
const mockSetDownloadStatus = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('DownloadDataDictionaryInfo', () => {
  it('should not set status when status response is not valid', async () => {
    const mockStatusResponse = {
      status: 500,
      data: null,
    };
    const discoveryConfig = {
      features: {
        exportToWorkspace: { variableMetadataFieldName: 'testName' },
      },
    } as DiscoveryConfig;

    const resourceInfo = { _hdp_uid: 'testUID' } as DiscoveryResource;
    const showDownloadVariableMetadataButton = true;
    const setDataDictionaryInfo = () => null;

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadDataDictionaryInfo(
        discoveryConfig,
        resourceInfo,
        showDownloadVariableMetadataButton,
        setDataDictionaryInfo
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled(); // download was unsuccessful
  });
  /*
  it('should download variable metadata when called with valid resource info', async () => {
    const mockDataDictionaries = {
      'QA_minimal_json_20230817.json': 'f79114a6-93bd-4970-b096-7b47aa6c16fa',
    };
    const mockStatusResponse = {
      status: 200,
      data: {
        data_dictionaries: mockDataDictionaries,
      },
    };
    const mockGenerateAsync = jest.fn().mockResolvedValue('zipContent');
    jest
      .spyOn(JSZip.prototype, 'generateAsync')
      .mockImplementation(mockGenerateAsync);
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      await DownloadVariableMetadata(mockResourceInfo, mockSetDownloadStatus);
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled(); // Download is successful, fail msg isn't set
    expect(require('file-saver').saveAs).toHaveBeenCalled(); // Zip file downloaded
  });*/
});
