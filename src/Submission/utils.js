import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

export const excludeSystemProperties = (node) => {
  const properties = node.properties && Object.keys(node.properties)
    .filter(key => (node.systemProperties ? !node.systemProperties.includes(key) : true))
    .reduce((acc, key) => {
      acc[key] = node.properties[key];
      return acc;
    }, {});
  return properties;
};

export const getDictionaryWithExcludeSystemProperties = (dictionary) => {
  const ret = Object.keys(dictionary)
    .map((nodeID) => {
      const node = dictionary[nodeID];
      if (!node.properties) return node;
      return {
        ...node,
        properties: excludeSystemProperties(node),
      };
    })
    .reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  return ret;
};

const FETCH_LIMIT = 1024;

export const getStartingUUID = (user, callback) => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&limit=1`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return data.records.length > 0 ? data.records[0].did : null;
    default:
      return null;
    }
  },
).then(res => dispatch(callback(user, [], res, FETCH_LIMIT)));
