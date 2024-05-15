import { act } from 'react-dom/test-utils';
import DownloadVariableMetadataInfo from './DownloadVariableMetadataInfo';
import { DiscoveryConfig } from '../../../../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../../../../Discovery';
import { mdsURL } from '../../../../../../../../localconf';
import { fetchWithCreds } from '../../../../../../../../actions';

const mockVariableLevelMetadata = {
  data_dictionaries: { 'QA_minimal_json_20230817.json': 'f79114a6-93bd-4970-b096-7b47aa6c16fa' },
  common_data_elements: { '5131 Pediatric Demographics': 'HDPCDE5131' },
};

const mockVariableLevelMetadataRecords = {
  dataDictionaries: { 'QA_minimal_json_20230817.json': 'f79114a6-93bd-4970-b096-7b47aa6c16fa' },
  cde: { '5131 Pediatric Demographics': 'HDPCDE5131' },
};

const discoveryConfig = {
  features: {
    exportToWorkspace: { variableMetadataFieldName: 'variable_level_metadata' },
  },
} as DiscoveryConfig;

const resourceInfo = { _hdp_uid: 'testUID' };
const showDownloadVariableMetadataButton = true;

jest.mock('../../../../../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));
const mockSetDownloadStatus = jest.fn();
afterEach(() => {
  jest.clearAllMocks();
});

describe('DownloadVariableMetadataInfo', () => {
  it('should not set download data dictionary info when called with invalid status number', async () => {
    const mockStatusResponse = {
      status: 500,
      data: {
        variable_level_metadata: mockVariableLevelMetadata,
      },
    };
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadVariableMetadataInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus,
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled();
  });

  it('should not download data dictionary info when called with invalid data', async () => {
    const mockStatusResponse = {
      status: 200,
      data: {
        variable_level_metadata: {},
      },
    };
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadVariableMetadataInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus,
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).not.toHaveBeenCalled();
  });

  it(`should not call fetchWithCreds or download data dictionary info when
    called with showDownloadVariableMetadataButton = false`, async () => {
    const mockStatusResponse = {
      status: 200,
      data: {
        variable_level_metadata: mockVariableLevelMetadata,
      },
    };
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadVariableMetadataInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        false, // showDownloadVariableMetadataButton
        mockSetDownloadStatus,
      );
    });
    expect(fetchWithCreds).not.toHaveBeenCalled();
    expect(mockSetDownloadStatus).not.toHaveBeenCalled();
  });

  it('should set data dictionary info when called with valid params', async () => {
    const mockStatusResponse = {
      status: 200,
      data: {
        variable_level_metadata: mockVariableLevelMetadata,
      },
    };
    (fetchWithCreds as jest.Mock).mockResolvedValue(mockStatusResponse);
    await act(async () => {
      DownloadVariableMetadataInfo(
        discoveryConfig,
        resourceInfo as unknown as DiscoveryResource,
        showDownloadVariableMetadataButton,
        mockSetDownloadStatus,
      );
    });
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.stringContaining(`${mdsURL}/${resourceInfo._hdp_uid}`),
    });
    expect(mockSetDownloadStatus).toHaveBeenCalledWith({
      noVariableLevelMetadata: false,
      variableLevelMetadataRecords: mockVariableLevelMetadataRecords,
    });
  });
});
