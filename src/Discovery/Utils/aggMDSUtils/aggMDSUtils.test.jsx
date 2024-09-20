import loadStudiesFromAggMDS from './aggMDSUtils';
import { aggMDSDataURL } from '../../../localconf';

describe('loadStudiesFromAggMDS', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  const mockResponse = {
    commons1: [
      {
        study1: {
          gen3_discovery: {
            dataType: ['type1', 'type2'],
            dataFormat: 'format1',
            tags: [{ category: 'existingTag', name: 'value' }],
          },
          data_dictionary: 'dictionary content',
        },
      },
    ],
  };

  it('should load and process studies correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    const result = await loadStudiesFromAggMDS();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      commons: 'commons1',
      dataFormat: 'format1',
      dataType: ['type1', 'type2'],
      frontend_uid: 'commons1_0',
      study_id: 'study1',
      tags: [
        { category: 'existingTag', name: 'value' },
        { category: 'Commons', name: 'commons1' },
      ],
    });
  });

  it('should throw an error when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      status: 401,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    const expectedLimit = 2000;
    const expectedOffset = 0;
    const url = `${aggMDSDataURL}?data=True&limit=${expectedLimit}&offset=${expectedOffset}`;
    const expectedErrorMsg = `Request for study data at ${url} failed.`;
    let actualErrorMsg = null;
    try {
      const result = await loadStudiesFromAggMDS();
    } catch (e) {
      actualErrorMsg = e.message;
    }
    expect(actualErrorMsg.toString().includes(expectedErrorMsg)).toBe(true);
  });

  it('should handle empty response correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    const result = await loadStudiesFromAggMDS();
    expect(result).toEqual([]);
  });
});
