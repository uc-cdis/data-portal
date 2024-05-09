import {
  assembleAndExportMetadata, assembleMetadata, exportAssembledMetadata, removeKeys,
} from './assembleAndExportMetadata';

describe('assembleAndExportMetadata', () => {
  it(`should call assembleMetadata function correctly after calling assembleAndExportMetadata`, async () => {
    const keysToRemove: Array<string> = ['key1', 'key2'];
    const selectedResources: Array<object> = [
      { key1: 'value1', key2: 'value2' },
      { key3: 'value3' },
    ];
    const mockFunctionA = jest.fn();
    jest.mock(assembleAndExportMetadata, () => ({
      ...jest.requireActual(assembleAndExportMetadata),
      assembleMetadata: mockFunctionA,
    }));

    await assembleAndExportMetadata(keysToRemove, selectedResources);
    expect(assembleMetadata).toHaveBeenCalledWith(keysToRemove, selectedResources);
    expect(exportAssembledMetadata).toHaveBeenCalledTimes(1);
    expect(exportAssembledMetadata).toHaveBeenCalledWith([{}, { key3: 'value3' }]);
  });
  /*
  it('should remove keys from cloned objects when keysToRemove are provided', () => {
    const obj1 = { key1: 'value1' };
    const obj2 = { key2: 'value2' };
    const keysToRemove = ['key1'];

    const assembleMetadataResult = assembleMetadata(keysToRemove, [obj1, obj2]);

    expect(assembleMetadataResult[0].key1).toBeUndefined();
    expect(assembleMetadataResult[1].key1).toBeDefined();
  });

  it('should not remove keys when keysToRemove are not provided', () => {
    const obj1 = { key1: 'value1' };
    const obj2 = { key2: 'value2' };
    const keysToRemove: Array<string> | undefined = undefined;

    const assembleMetadataResult = assembleMetadata(keysToRemove, [obj1, obj2]);

    expect(assembleMetadataResult[0].key1).toEqual('value1');
    expect(assembleMetadataResult[1].key2).toEqual('value2');
  });
*/
});
