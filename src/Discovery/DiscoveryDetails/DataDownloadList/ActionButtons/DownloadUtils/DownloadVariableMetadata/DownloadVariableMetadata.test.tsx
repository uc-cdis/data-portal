import JSZip from 'jszip';
import { act } from 'react-dom/test-utils';
import DownloadVariableMetadata from './DownloadVariableMetadata';
import { fetchWithCreds } from '../../../../../../actions';
import { mdsURL } from '../../../../../../localconf';

jest.mock('../../../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
const mockResourceInfo = {
  _hdp_uid: 'HDP00001',
  project_title: 'Sample Project',
};

afterEach(() => {
  jest.clearAllMocks();
});

const mockSetDownloadStatus = jest.fn();

describe('DownloadVariableMetadata', () => {
  it('should set download status when status response is not successful', async () => {
    const mockStatusResponse = {
      status: 500,
      data: null,
    };

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);

    await act(async () => {
      await DownloadVariableMetadata(mockResourceInfo, mockSetDownloadStatus);
    });

    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${mockResourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).toHaveBeenCalled(); // download was unsuccessful
    expect(require('file-saver').saveAs).not.toHaveBeenCalled(); // zip file didn't downloaded
  });

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
    expect(require('file-saver').saveAs).toHaveBeenCalledTimes(1); // Zip file downloaded
  });
});
