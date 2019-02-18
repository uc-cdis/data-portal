import FileSaver from 'file-saver';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import { dataDictionaryTemplatePath, appname } from '../localconf';

const concatTwoWords = (w1, w2) => {
  if (w1.length === 0) return w2;
  if (w2.length === 0) return w1;
  return `${w1} ${w2}`;
};

export const truncateLines = (str, maxCharInRow = 10, breakwordMinLength = 12) => {
  const wordsList = str.split(' ');
  const res = [];
  let currentLine = '';
  for (let i = 0; i < wordsList.length; i += 1) {
    // if adding a new word will make the current line too long
    if (concatTwoWords(currentLine, wordsList[i]).length > maxCharInRow) {
      // if the new word itself is too long, break it
      if (wordsList[i].length > breakwordMinLength) {
        let breakPos = maxCharInRow - currentLine.length - 1;
        if (currentLine.length > 0) breakPos -= 1; // 1 more for space
        res.push(`${concatTwoWords(currentLine, wordsList[i].substring(0, breakPos))}-`);

        // break the rest of the new word if it's still too long
        while (breakPos + maxCharInRow < wordsList[i].length) {
          const nextBreakPos = (breakPos + maxCharInRow) - 1;
          res.push(`${wordsList[i].substring(breakPos, nextBreakPos)}-`);
          breakPos = nextBreakPos;
        }
        currentLine = wordsList[i].substring(breakPos);
      } else { // else, end current line and create a new line
        if (currentLine.length > 0) { // avoid adding first empty line
          res.push(currentLine);
        }
        currentLine = wordsList[i];
      }
    } else { // else, just add the new word to current line
      currentLine = concatTwoWords(currentLine, wordsList[i]);
    }
  }
  res.push(currentLine);
  return res;
};

/**
 * Little helper to extract the type for some dictionary node property.
 * Export just for testing.
 * @param {Object} property one of the properties of a dictionary node
 * @return {String|Array<String>} string for scalar types, array for enums
 *                   and other listish types or 'UNDEFINED' if no
 *                   type information availabale
 */
export const getType = (property) => {
  let type = 'UNDEFINED';
  if ('type' in property) {
    if (typeof property.type === 'string') {
      type = property.type;
    } else {
      type = property.type;
    }
  } else if ('enum' in property) {
    type = property.enum;
  } else if ('oneOf' in property) {
    // oneOf has nested type list - we want to flatten nested enums out here ...
    type = property.oneOf
      .map(item => getType(item))
      .reduce(
        (flatList, it) => {
          if (Array.isArray(it)) {
            return flatList.concat(it);
          }
          flatList.push(it);
          return flatList;
        }, [],
      );
  } else if ('anyOf' in property) {
    // anyOf has nested type list
    type = property.anyOf
      .map(item => getType(item))
      .reduce(
        (flatList, it) => {
          if (Array.isArray(it)) {
            return flatList.concat(it);
          }
          flatList.push(it);
          return flatList;
        }, [],
      );
  } else {
    type = 'UNDEFINED';
  }

  return type;
};

export const downloadTemplate = (format, nodeId) => {
  if (format === 'tsv' || format === 'json') {
    const templatePath = `${dataDictionaryTemplatePath}${nodeId}?format=${format}`;
    window.open(templatePath);
  }
};

export const downloadMultiTemplate = (
  format,
  nodesToDownload,
  allRoutes,
  clickingNodeName,
  dictionaryVersion,
) => {
  if (format !== 'tsv' && format !== 'json') {
    return;
  }
  const zip = new JSZip();
  Promise.all(Object.keys(nodesToDownload).map((nodeID) => {
    const fileUrl = `${dataDictionaryTemplatePath}${nodeID}?format=${format}`;
    const saveAsFileName = nodesToDownload[nodeID];
    return fetch(fileUrl).then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error(`cannot download template for node "${nodeID}"`);
    }).then((responseText) => {
      zip.file(saveAsFileName, responseText);
    }).catch(() => {
      throw new Error(`cannot download template for node "${nodeID}"`);
    });
  })).then(() => {
    const time = new Date();
    const startingNodeName = 'Project';
    let readmeContent = `The following ${format.toUpperCase()} templates were downloaded from ${appname} on ${time.toLocaleDateString()} ${time.toLocaleTimeString()}. The following are all possible paths from "${startingNodeName}" node to "${clickingNodeName}" using data dictionary version ${dictionaryVersion}. The downloaded ${format.toUpperCase()} files need to be submitted in the order shown in the chosen path(s) below:\n`;
    readmeContent = readmeContent.concat(
      allRoutes.map((nodeIDsInRoute, routeIndex) => `${routeIndex + 1}. ${nodeIDsInRoute.join(',')}`).join('\n'),
    );
    zip.file('README.txt', readmeContent);
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        FileSaver.saveAs(content, `templates-${format}.zip`);
      });
  });
};

export const graphStyleConfig = {
  nodeTextFontSize: 10,
  nodeTextLineGap: 4,
  nodeContentPadding: 20,
  nodeIconRadius: 10,
};

export const parseDictionaryNodes = dictionary => Object.keys(dictionary).filter(
  id => id.charAt(0) !== '_' && id === dictionary[id].id,
).map(
  (id) => {
    const originNode = dictionary[id];
    return originNode;
  },
).filter(
  node => node.category && node.id,
);

export const getPropertyDescription = (property) => {
  let description;
  if ('description' in property) {
    description = property.description;
  }
  if ('term' in property) {
    description = property.term.description;
  }
  return description;
};

const searchHistoryLocalStorageKey = 'datadictionary:searchHistory';
/**
 * @typedef {Object} SearchHistoryItem
 * @property {string} keywordStr - keywordStr of this item
 * @property {integer} matchedCount - matched count for this keyword
 */

/**
 * Get search history items from localStorage
 * @returns {SearchHistoryItem[]} array of search history items
 */
export const getSearchHistoryItems = () => {
  const items = JSON.parse(localStorage.getItem(searchHistoryLocalStorageKey));
  return items;
};

/**
 * Add search history item to localStorage
 * @params {SearchHistoryItem} searchHistoryItem - item to add into localStorage
 * @returns {SearchHistoryItem[]} array of new search history items
 */
export const addSearchHistoryItems = (searchHistoryItem) => {
  const { keywordStr } = searchHistoryItem;
  if (!keywordStr || keywordStr.length === 0) return getSearchHistoryItems();
  const prevHistory = JSON.parse(localStorage.getItem(searchHistoryLocalStorageKey));
  let newHistory = [];
  if (prevHistory) newHistory = prevHistory.slice(0); // clone array

  // if item already exists, need to remove item before adding to the beginning
  if (prevHistory && prevHistory.find(item => item.keywordStr === keywordStr)) {
    const index = prevHistory.findIndex(item => item.keywordStr === keywordStr);
    newHistory = prevHistory.slice(0);
    newHistory.splice(index, 1); // remove item
  }
  newHistory.unshift(searchHistoryItem); // add to the beginning
  localStorage.setItem(searchHistoryLocalStorageKey, JSON.stringify(newHistory));
  return newHistory;
};

/**
 * Clear search history item in localStorage
 * @returns {SearchHistoryItem[]} empty array as new search history items
 */
export const clearSearchHistoryItems = () => {
  const newHistory = [];
  localStorage.setItem(searchHistoryLocalStorageKey, JSON.stringify(newHistory));
  return newHistory;
};

export const MatchedIndicesShape = PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number));

export const MatchedItemShape = PropTypes.shape({
  indices: MatchedIndicesShape,
  arrayIndex: PropTypes.number,
  key: PropTypes.string,
  value: PropTypes.string,
});

export const SearchItemPropertyShape = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
});

export const SearchItemShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  properties: PropTypes.arrayOf(SearchItemPropertyShape),
});

export const SearchResultItemShape = PropTypes.shape({
  item: SearchItemShape,
  matches: PropTypes.arrayOf(MatchedItemShape),
});
