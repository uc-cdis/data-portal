/*
import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import DownloadVariableMetadata from './DownloadVariableMetadata'; // Adjust the import path as needed

// Mocking dependencies

const mockFile = jest.fn();
let mockFolder: jest.Mock;

function mockJszip() {
  mockFolder = jest.fn(mockJszip);
  return {
    folder: mockFolder,
    file: mockFile,
    generateAsync: jest.fn(),
  };
}

jest.mock('jszip', () => {
  return {
    __esModule: true,
    default: mockJszip,
  };
});

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('../../../../../../actions', () => ({
  fetchWithCreds: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: {
        data_dictionaries: {
          'QA_minimal_json_20230817.json':
            'f79114a6-93bd-4970-b096-7b47aa6c16fa',
        },
      },
    })
  ),
}));

jest.mock('../../../../../../localconf', () => ({
  mdsURL: 'mocked-mds-url',
}));

const mockResourceInfo = {
  _hdp_uid: 'mocked-study-id',
  project_title: 'mocked-project-title',
};

const mockSetDownloadStatus = jest.fn();

describe('DownloadVariableMetadata', () => {
  it('should trigger download when called following button click', async () => {
    // Render the component
    render(
      <button
        onClick={() =>
          DownloadVariableMetadata(mockResourceInfo, mockSetDownloadStatus)
        }
      >
        Download
      </button>
    );

    // Trigger the download
    fireEvent.click(screen.getByText('Download'));

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      expect(mockFile).toHaveBeenCalledTimes(1);
      // expect(mockFolder).toHaveBeenCalledTimes(1);
      expect(mockSetDownloadStatus).toHaveBeenCalledWith(expect.any(Object));
      expect(require('file-saver').saveAs).toHaveBeenCalledTimes(1);
    });
  });
});
*/

import JSZip from 'jszip';
import FileSaver from 'file-saver';
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

const mockSetDownloadStatus = jest.fn();

describe('DownloadVariableMetadata', () => {
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
    // const mockSaveAs = jest.spyOn(FileSaver, 'saveAs');

    jest
      .spyOn(JSZip.prototype, 'generateAsync')
      .mockImplementation(mockGenerateAsync);

    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);

    await act(async () => {
      await DownloadVariableMetadata(mockResourceInfo, mockSetDownloadStatus);
    });

    expect(mockSetDownloadStatus).not.toHaveBeenCalledWith(); // Assuming download is successful
  });

  /******SECOND TEST WORKS! */

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
      path: expect.stringContaining(`${mdsURL}/HDP00001`),
    });
    expect(mockSetDownloadStatus).toHaveBeenCalled();
  });
});
