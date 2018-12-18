import Fuse from 'fuse.js';
import {
  parseDictionaryNodes,
  getPropertyDescription,
  getType,
} from '../../utils';

/**
 * Prepare search items for Fuse.io library, call Fuse constructor 
 * and return a search instance handler. 
 * For calling search function using search instance hanlder, just call handler.search(keyword), 
 * it will return an array of SearchResultItemShape (see ../../utils). 
 * @params [Object] dictionary
 * @returns [Object] Fuse search instance
 */
export const prepareSearch = (dictionary) => {
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
    minMatchCharLength: 2,
  };
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
  return new Fuse(searchData, options);
};

/**
 * Prepare search items for Fuse.io library, call Fuse constructor 
 * and return a search instance handler. 
 * @params [SearchResultItemShape[]] search result (SearchResultItemShape from '../../utils')
 * @returns [Object] summary: { matchedPropertiesCount: number, matchedNodesCount: number }
 */
export const getSearchSummary = (result) => {
  let matchedPropertiesCount = 0;
  let matchedNodesCount = 0;
  result.forEach((resItem) => {
    resItem.matches.forEach((matchedItem) => {
      switch (matchedItem.key) {
      case 'properties.type':
      case 'properties.name':
      case 'properties.description':
        matchedPropertiesCount += 1;
        break;
      case 'title':
      case 'description':
        matchedNodesCount += 1;
        break;
      default:
        break;
      }
    });
  });
  return {
    matchedPropertiesCount,
    matchedNodesCount,
  };
};
