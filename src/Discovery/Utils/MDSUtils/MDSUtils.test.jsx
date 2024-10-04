import loadStudiesFromMDS from './MDSUtils';
import { mdsURL } from '../../../localconf';

global.fetch = jest.fn();

describe('MDS Data Loading Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadStudiesFromMDS', () => {
    it('should load studies successfully with limit of 2000', async () => {
      const mockResponse = {
        0: { gen3_discovery: { name: 'Study 1' } },
        1: { gen3_discovery: { name: 'Study 2' } },
      };
      fetch.mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
      const studies = await loadStudiesFromMDS();
      expect(studies).toEqual([{ name: 'Study 1' }, { name: 'Study 2' }]);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${mdsURL}?data=True&_guid_type=discovery_metadata&limit=2000&offset=0`,
      );
    });

    it('should load studies successfully with limit of 3 with loadAllMetadata false', async () => {
      const mockResponse = {
        0: { gen3_discovery: { name: 'Study 1' } },
        1: { gen3_discovery: { name: 'Study 2' } },
        2: { gen3_discovery: { name: 'Study 3' } },
      };
      fetch.mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
      const studies = await loadStudiesFromMDS('discovery_metadata', 3, false);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${mdsURL}?data=True&_guid_type=discovery_metadata&limit=3&offset=0`,
      );
      expect(studies).toEqual([{ name: 'Study 1' },{ name: 'Study 2' },{ name: 'Study 3' }]);
    });

    it('should throw an error on fetch failure', async () => {
      const mockResponse = {
        0: { gen3_discovery: { name: 'Study 1' } },
        1: { gen3_discovery: { name: 'Study 2' } },
      };
      fetch.mockResolvedValueOnce({
        status: 401,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
      const expectedErrorMsg = 'Request for study data failed: Error';
      let actualErrorMsg = null;
      try {
        await loadStudiesFromMDS();
      } catch (e) {
        actualErrorMsg = e.message;
      }
      expect(actualErrorMsg.toString().includes(expectedErrorMsg)).toBe(true);
    });

    it('should load up to 2000 studies, then load more with a secondary request', async () => {
      const mockStudies = new Array(2500).fill({ mockStudy: 'info' });
      // Simulate first fetch (2000 studies)
      fetch.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockStudies.slice(0, 2000)),
      }),
      );

      // Simulate second fetch (500 studies)
      fetch.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockStudies.slice(2000, 2500)),
      }),
      );
      const studies = await loadStudiesFromMDS();
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(studies.length).toBe(2500);
    });
  });
});
