import FileSaver from 'file-saver';
import DownloadJsonFile from './DownloadJsonFile';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('DownloadJsonFile', () => {
  test('downloads JSON file with correct title', () => {
    // Set up mock data
    const fileName = 'testFile';
    const testData = { key: 'value' };

    // Call the DownloadJsonFile function
    DownloadJsonFile(fileName, testData);

    // Assert that saveAs is called with the correct arguments
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      'testFile.json',
    );
  });
});
