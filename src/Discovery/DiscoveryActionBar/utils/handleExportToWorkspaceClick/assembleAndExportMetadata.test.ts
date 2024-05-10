import { removeKeys, assembleMetadata, exportAssembledMetadata, assembleAndExportMetadata } from './assembleAndExportMetadata';
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
});

describe('exportAssembledMetadata', () => {
  it('should call fetchWithCreds with the correct parameters', async () => {
    const filteredData = [{ a: 1 }, { b: 2 }];
    const mockResponse = { status: 200 };
    fetchWithCreds.mockResolvedValue(mockResponse);

    await exportAssembledMetadata(filteredData);

    expect(fetchWithCreds).toHaveBeenCalledWith({
      path: expect.any(String), // You may want to specify the exact path
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
  it('should call assembleMetadata and exportAssembledMetadata', () => {
    const keysToRemove = ['b.c'];
    const selectedResources = [{ a: 1 }];
    const filteredData = [{ a: 1 }];
    const mockExportFn = jest.fn();
    const originalAssembleMetadata = jest.spyOn(global, 'assembleMetadata');
    originalAssembleMetadata.mockReturnValue(filteredData);
    const originalExportMetadata = jest.spyOn(global, 'exportAssembledMetadata');
    originalExportMetadata.mockImplementation(mockExportFn);

    assembleAndExportMetadata(keysToRemove, selectedResources);

    expect(originalAssembleMetadata).toHaveBeenCalledWith(keysToRemove, selectedResources);
    expect(originalExportMetadata).toHaveBeenCalledWith(filteredData);
    expect(mockExportFn).toHaveBeenCalled();

    originalAssembleMetadata.mockRestore();
    originalExportMetadata.mockRestore();
  });
});
