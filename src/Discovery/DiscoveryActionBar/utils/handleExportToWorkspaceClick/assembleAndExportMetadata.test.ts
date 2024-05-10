import {
  removeKeys, assembleMetadata, exportAssembledMetadata, assembleAndExportMetadata,
} from './assembleAndExportMetadata';
import { fetchWithCreds } from '../../../../actions';

jest.mock('../../../../actions', () => ({
  fetchWithCreds: jest.fn(),
}));

describe('removeKeys', () => {
  it('should remove specified keys from the object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    };
    const keysToRemove = ['b.c'];
    removeKeys(obj, keysToRemove);
    expect(obj).toEqual({ a: 1, b: { d: 3 } });
  });
});

describe('assembleMetadata', () => {
  it('should return an array of objects with specified keys removed', () => {
    const keysToRemove = ['b.c'];
    const selectedResources = [
      { a: 1, b: { c: 2, d: 3 } },
      { x: 10, y: { z: 20 } },
    ];
    const result = assembleMetadata(keysToRemove, selectedResources);
    expect(result).toEqual([
      { a: 1, b: { d: 3 } },
      { x: 10, y: { z: 20 } },
    ]);
  });
  it('should return an array of objects with specified keys removed and remove their children', () => {
    const keysToRemove = ['b.c'];
    const selectedResources = [
      {
        a: 1,
        b: {
          c: { d: { e: { f: 'test' } } }, g: 3,
        },
      },
      { x: 10, y: { z: 20 } },
    ];
    const result = assembleMetadata(keysToRemove, selectedResources);
    expect(result).toEqual([
      { a: 1, b: { g: 3 } },
      { x: 10, y: { z: 20 } },
    ]);
  });
  it('should return an array of objects with no specified keys removed when keysToRemove is empty', () => {
    const keysToRemove = [];
    const selectedResources = [
      { a: 1, b: { c: 2, d: 3 } },
      { x: 10, y: { z: 20 } },
    ];
    const result = assembleMetadata(keysToRemove, selectedResources);
    expect(result).toEqual(selectedResources);
  });
  it('should return an array of objects with specified keys removed when there are multiple nestings', () => {
    const keysToRemove = ['b.c.d.e.f', 'x', 'y.z'];
    const selectedResources = [
      {
        a: 1,
        b:
        {
          c:
          {
            d: {
              e:
              {
                f: 'test',
              },
            },
          },
        },
      }, { x: 10, y: { z: 20 } },
    ];
    const result = assembleMetadata(keysToRemove, selectedResources);
    expect(result).toEqual([
      {
        a: 1,
        b: {
          c: {
            d: {
              e: {},
            },
          },
        },
      },
      {
        y: {},
      },
    ]);
  });
});

describe('exportAssembledMetadata', () => {
  it('should call fetchWithCreds with the correct parameters', async () => {
    const filteredData = [{ a: 1 }, { b: 2 }];
    const mockResponse = { status: 200 };
    fetchWithCreds.mockResolvedValue(mockResponse);

    await exportAssembledMetadata(filteredData);

    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.any(String),
      body: JSON.stringify(filteredData),
      method: 'POST',
    });
  });

  it('should throw an error if response status is not 200', async () => {
    const filteredData = [{ a: 1 }, { b: 2 }];
    const mockResponse = { status: 500 };
    fetchWithCreds.mockResolvedValue(mockResponse);
    await expect(exportAssembledMetadata(filteredData)).rejects.toThrow(
      `Encountered error while exporting assembled metadata: ${JSON.stringify(mockResponse)}`,
    );
  });
});

describe('assembleAndExportMetadata', () => {
  it(`should call fetchWithCreds with the correct parameters after calling
      assembleMetadata and exportAssembledMetadata`, async () => {
    const unfilteredData = [{ a: 1 }, { b: 2 }];
    const filteredData = [{}, { b: 2 }];
    const selectedResources = ['a'];
    const mockResponse = { status: 200 };
    fetchWithCreds.mockResolvedValue(mockResponse);
    await assembleAndExportMetadata(selectedResources, unfilteredData);
    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.any(String),
      body: JSON.stringify(filteredData),
      method: 'POST',
    });
  });
});
