import { get, unset, cloneDeep } from 'lodash';
import { manifestServiceApiPath } from '../../../../localconf';
import { fetchWithCreds } from '../../../../actions';

const removeKeys = (obj: object, keysToRemove: Array<string>) => {
  keysToRemove.forEach((key) => {
    if (key.includes('.')) {
      const [firstKey, ...nestedKeys] = key.split('.');
      const nestedObj = get(obj, firstKey);
      unset(nestedObj, nestedKeys.join('.'));
    } else {
      unset(obj, key);
    }
  });
  return obj;
};

const assembleMetadata = (keysToRemove:Array<string>, selectedResources:Array<object>) => {
  console.log('hello world');
  console.log('keysToRemove', keysToRemove);
  console.log('selectedResources', selectedResources);
  const filteredData = selectedResources.map((obj) => {
    const clonedObj = cloneDeep(obj);
    // if there are keysToRemove, remove them
    if (keysToRemove) {
      return removeKeys(clonedObj, keysToRemove);
    }
    // Otherwise just return the cloned object
    return clonedObj;
  });
  console.log('filteredData', filteredData);
  return filteredData;
};
const exportAssembledMetadata = async (filteredData:Array<object>) => {
  console.log('manifestServiceApiPath', manifestServiceApiPath);
  const res = await fetchWithCreds({
    path: `${manifestServiceApiPath}/metadata`,
    // path: `${manifestServiceApiPath}`,
    body: JSON.stringify(filteredData),
    method: 'POST',
  });
  console.log('res ln 42 in assembleAndExportMetadata', res);
  if (res.status !== 200) {
    throw new Error(
      `Encountered error while exporting assembled metadata: ${JSON.stringify(res)}`,
    );
  }
};

const assembleAndExportMetadata = (keysToRemove: Array<string>, selectedResources:Array<object>) => {
  const filteredData = assembleMetadata(keysToRemove as Array<string>, selectedResources);
  exportAssembledMetadata(filteredData);
};

export {
  exportAssembledMetadata, assembleMetadata, removeKeys, assembleAndExportMetadata,
};
