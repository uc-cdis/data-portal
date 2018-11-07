import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../utils';
import DataDictionaryNode from './DataDictionaryNode';
import './DataDictionaryTable.css';

const DataDictionaryCategory = ({ nodes, category, highlightingNodeID, onExpandNode }) => (
  <div className='data-dictionary-table__category'>
    <div className='data-dictionary-table__category-head'>
      <span>
        {capitalizeFirstLetter(category)}
      </span>
      <span className='data-dictionary-table__category-download_template'>Download Template</span>
    </div>
    {
      nodes.map(
        node => (<DataDictionaryNode
          node={node}
          key={node.id}
          description={node.description}
          expanded={highlightingNodeID && highlightingNodeID === node.id}
          onExpandNode={onExpandNode}
        />),
      )
    }
  </div>
);

DataDictionaryCategory.propTypes = {
  category: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  highlightingNodeID: PropTypes.string,
};

DataDictionaryCategory.defaultProps = {
  highlightingNodeID: null,
};

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

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionaryTable = ({ dictionary, highlightingNodeID, onExpandNode }) => {
  const c2nl = category2NodeList(dictionary);
  const dictionaryName = 'Test';
  const nodesCount = 0;
  const propertiesCount = 0;
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
};

DataDictionaryTable.defaultProps = {
  dictionary: {},
  highlightingNodeID: null,
  onExpandNode: () => {},
};

export default DataDictionaryTable;
