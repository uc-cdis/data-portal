import loadStudiesFromAggMDS, { loadStudyFromAggMDS } from './aggMDSUtils';
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
      await loadStudiesFromAggMDS();
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

  it('should page through studies until a page is not full', async () => {
    const makeEntry = (id) => ({ [id]: { gen3_discovery: { name: id } } });
    // page size 2: first page full (2), second page short (1)
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({
        commons1: [makeEntry('study1'), makeEntry('study2')],
      }),
    });
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({
        commons1: [makeEntry('study3')],
      }),
    });
    const result = await loadStudiesFromAggMDS(2);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${aggMDSDataURL}?data=True&limit=2&offset=0`);
    expect(global.fetch).toHaveBeenNthCalledWith(2, `${aggMDSDataURL}?data=True&limit=2&offset=2`);
    expect(result.map((s) => s.study_id)).toEqual(['study1', 'study2', 'study3']);
    // frontend_uid must stay unique across pages
    expect(result.map((s) => s.frontend_uid)).toEqual(['commons1_0', 'commons1_1', 'commons1_2']);
  });

  it('should make one extra request when the last page is exactly full', async () => {
    const makeEntry = (id) => ({ [id]: { gen3_discovery: { name: id } } });
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({
        commons1: [makeEntry('study1')],
        commons2: [makeEntry('study2')],
      }),
    });
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    const result = await loadStudiesFromAggMDS(2);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
  });
});

describe('loadStudyFromAggMDS', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load a single study with its commons info', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({
        commons_name: 'commons1',
        gen3_discovery: { name: 'Study 1', commons_url: 'commons1.org', tags: [] },
      }),
    });
    const study = await loadStudyFromAggMDS('study/1');

    expect(global.fetch).toHaveBeenCalledWith(`${aggMDSDataURL}/guid/study%2F1`);
    expect(study).toMatchObject({
      name: 'Study 1',
      study_id: 'study/1',
      commons: 'commons1',
      commons_url: 'commons1.org',
      tags: [{ category: 'Commons', name: 'commons1' }],
    });
  });

  it('should throw when the request fails', async () => {
    global.fetch.mockResolvedValueOnce({ status: 404, json: jest.fn() });
    await expect(loadStudyFromAggMDS('study1')).rejects.toThrow('failed with status 404');
  });

  it('should throw when the study has no gen3_discovery data', async () => {
    global.fetch.mockResolvedValueOnce({ status: 200, json: jest.fn().mockResolvedValueOnce({}) });
    await expect(loadStudyFromAggMDS('study1')).rejects.toThrow('not found in aggregate MDS');
  });
});
