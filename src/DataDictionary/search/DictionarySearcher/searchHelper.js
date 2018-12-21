import Fuse from 'fuse.js';
import {
  parseDictionaryNodes,
  getPropertyDescription,
  getType,
} from '../../utils';

/**
 * Prepare search items for Fuse.io library
 * @params [Object] dictionary
 * @returns [Object] search data
 */
export const prepareSearchData = (dictionary) => {
  const searchData = parseDictionaryNodes(dictionary)
    .map((node) => {
      const properties = Object.keys(node.properties).map((propertyKey) => {
        let type = getType(node.properties[propertyKey]);
        if (type === 'UNDEFINED') type = undefined;
        const propertyDescription = getPropertyDescription(node.properties[propertyKey]);
        return {
          name: propertyKey,
          description: propertyDescription,
          type,
        };
      });
      return {
        id: node.id,
        title: node.title,
        description: node.description,
        properties,
      };
    });
  return searchData;
};

/**
 * Call Fuse search and returns search result
 * @params [Object] searchData - see prepareSearchData returns
 * @params [string] keyword
 * @returns [SearchResultItemShape[]] (see ../../utils).
 */
export const searchKeyword = (searchData, keyword) => {
  if (!keyword || keyword.length < 2) return [];
  const halfLength = Math.round(keyword.length / 2);
  const minMatchCharLength = Math.min(Math.max(halfLength, 10), keyword.length);
  const options = {
    keys: [
      'title',
      'description',
      'properties.name',
      'properties.description',
      'properties.type',
    ],
    includeMatches: true,
    threshold: 0.3,
    shouldSort: true,
    includeScore: true,
    minMatchCharLength,
  };
  const handler = new Fuse(searchData, options);
  const result = handler.search(keyword)
    .map((resItem) => {
      // A bug in Fuse sometimes returns wrong indices that end < start
      const matches = resItem.matches
        .filter(matchItem => matchItem.indices[0][1] >= matchItem.indices[0][0]);
      return {
        ...resItem,
        matches,
      };
    })
    .filter(resItem => resItem.matches.length > 0);
  return result;
};

/**
 * Prepare search items for Fuse.io library, call Fuse constructor
 * and return a search instance handler.
 * @params [SearchResultItemShape[]] search result (SearchResultItemShape from '../../utils')
 * @returns [Object] summary
 */
export const getSearchSummary = (result) => {
  const matchedNodeIDsInNameAndDescription = [];
  const matchedNodeIDsInProperties = [];
  const generalMatchedNodeIDs = [];
  let matchedPropertiesCount = 0;
  let matchedNodeNameAndDescriptionsCount = 0;
  result.forEach((resItem) => {
    const nodeID = resItem.item.id;
    resItem.matches.forEach((matchedItem) => {
      switch (matchedItem.key) {
      case 'properties.type':
      case 'properties.name':
      case 'properties.description':
        matchedPropertiesCount += 1;
        if (!matchedNodeIDsInProperties.includes(nodeID)) {
          matchedNodeIDsInProperties.push(nodeID);
        }
        if (!generalMatchedNodeIDs.includes(nodeID)) {
          generalMatchedNodeIDs.push(nodeID);
        }
        break;
      case 'title':
      case 'description':
        matchedNodeNameAndDescriptionsCount += 1;
        if (!matchedNodeIDsInNameAndDescription.includes(nodeID)) {
          matchedNodeIDsInNameAndDescription.push(nodeID);
        }
        if (!generalMatchedNodeIDs.includes(nodeID)) {
          generalMatchedNodeIDs.push(nodeID);
        }
        break;
      default:
        break;
      }
    });
  });
  return {
    matchedPropertiesCount,
    matchedNodeNameAndDescriptionsCount,
    matchedNodeIDsInNameAndDescription,
    matchedNodeIDsInProperties,
    generalMatchedNodeIDs,
  };
};
