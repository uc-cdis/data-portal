import React from 'react';
import PropTypes from 'prop-types';
import './DataDictionaryTable.css';
import { parseDictionaryNodes } from '../../utils';
import DataDictionaryCategory from '../DataDictionaryCategory/.';

/**
 * Just exported for testing
 * Little helper that extacts a mapping of category-name to
 * the list of nodes in that category given a dictionary definition object
 *
 * @param {Object} dictionary
 * @return {} mapping from category to node list
 */
/* eslint-disable no-param-reassign */
export function category2NodeList(dictionary) {
  const res = Object.keys(dictionary).filter(
    id => id.charAt(0) !== '_' && id === dictionary[id].id,
  ).map(
    id => dictionary[id],
  ).filter(
    node => node.category && node.id,
  )
    .reduce(
      (lookup, node) => {
        if (!lookup[node.category]) {
          lookup[node.category] = [];
        }
        lookup[node.category].push(node);
        return lookup;
      }, {},
    );
  return res;
}
/* eslint-enable no-param-reassign */

const getNodePropertyCount = (dictionary) => {
  const res = parseDictionaryNodes(dictionary)
    .reduce((acc, node) => {
      acc.nodesCount += 1;
      acc.propertiesCount += Object.keys(node.properties).length;
      return acc;
    }, {
      nodesCount: 0,
      propertiesCount: 0,
    });
  return {
    nodesCount: res.nodesCount,
    propertiesCount: res.propertiesCount,
  };
};

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionaryTable = ({ dictionary, highlightingNodeID, onExpandNode, dictionaryName }) => {
  const c2nl = category2NodeList(dictionary);
  const { nodesCount, propertiesCount } = getNodePropertyCount(dictionary);
  return (
    <React.Fragment>
      <p>
        <span>{dictionaryName}</span>
        <span> dictionary has </span>
        <span>{nodesCount}</span>
        <span> nodes and </span>
        <span>{propertiesCount}</span>
        <span> properties </span>
      </p>
      {Object.keys(c2nl).map(category =>
        (<DataDictionaryCategory
          key={category}
          nodes={c2nl[category]}
          category={category}
          highlightingNodeID={highlightingNodeID}
          onExpandNode={onExpandNode}
        />))}
    </React.Fragment>
  );
};

DataDictionaryTable.propTypes = {
  dictionary: PropTypes.object,
  highlightingNodeID: PropTypes.string,
  onExpandNode: PropTypes.func,
  dictionaryName: PropTypes.string,
};

DataDictionaryTable.defaultProps = {
  dictionary: {},
  highlightingNodeID: null,
  onExpandNode: () => {},
  dictionaryName: '',
};

export default DataDictionaryTable;
