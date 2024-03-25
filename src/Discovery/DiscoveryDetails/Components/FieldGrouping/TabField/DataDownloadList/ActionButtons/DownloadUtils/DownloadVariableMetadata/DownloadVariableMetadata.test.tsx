import JSZip from 'jszip';
import { act } from 'react-dom/test-utils';
import DownloadVariableMetadata from './DownloadVariableMetadata';
import { fetchWithCreds } from '../../../../../../../../../actions';
import { INITIAL_DOWNLOAD_STATUS } from '../Constants';
import { DiscoveryResource } from '../../../../../../../../Discovery';

/* eslint global-require: 0 */ // --> OFF
jest.mock('../../../../../../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
const mockResourceInfo = {
  _hdp_uid: 'HDP00001',
  project_title: 'Sample Project',
};

const mockDataDictionaries = {
  'anotherDataDictionary.json': 'string-associated-with-file-name',
};

const mockSetDownloadStatus = jest.fn();
console.error = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('DownloadVariableMetadata', () => {
  it('should download variable metadata when called with valid resource info', async () => {
    const mockStatusResponse = {
      status: 200,
      data: { test: 'json-response' },
    };
    const mockGenerateAsync = jest.fn().mockResolvedValue('zipContent');
    jest
      .spyOn(JSZip.prototype, 'generateAsync')
      .mockImplementation(mockGenerateAsync);
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      await DownloadVariableMetadata(
        mockDataDictionaries,
        mockResourceInfo as unknown as DiscoveryResource,
        mockSetDownloadStatus,
      );
    });
    expect(mockSetDownloadStatus).toHaveBeenCalled(); // Status should be set to in progress and then cleared
    expect(mockSetDownloadStatus).toHaveBeenCalledWith({
      inProgress: 'DownloadVariableMetadata',
      message: INITIAL_DOWNLOAD_STATUS.message,
    });
    expect(mockSetDownloadStatus).toHaveBeenCalledWith({
      ...INITIAL_DOWNLOAD_STATUS,
      inProgress: 'DownloadVariableMetadata',
    });
    expect(require('file-saver').saveAs).toHaveBeenCalled(); // Zip file downloaded
  });

  it('should not download variable metadata when status response is not 200', async () => {
    const mockStatusResponse = {
      status: 500,
      data: { test: 'json-response' },
    };
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      await DownloadVariableMetadata(
        mockDataDictionaries,
        mockResourceInfo as unknown as DiscoveryResource,
        mockSetDownloadStatus,
      );
    });
    expect(mockSetDownloadStatus).toHaveBeenCalled();
    expect(require('file-saver').saveAs).not.toHaveBeenCalled(); // Zip file downloaded
  });
});
