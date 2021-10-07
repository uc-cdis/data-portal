import React from 'react';
import PropTypes from 'prop-types';
import DataDictionaryCategory from '../DataDictionaryCategory';
import './DataDictionaryTable.css';

/**
 * Little helper that extacts a mapping of category-name to
 * the list of nodes in that category given a dictionary definition object
 * @return mapping from category to node list
 */
export function category2NodeList(nodes) {
  /** @type {{ [category: string]: Object[] }} */
  const mapping = {};
  for (const node of nodes)
    if (node.category in mapping) mapping[node.category].push(node);
    else mapping[node.category] = [node];

  return mapping;
}

function getNodePropertyCount(nodes) {
  let propertiesCount = 0;
  for (const { properties } of nodes)
    propertiesCount += Object.keys(properties).length;

  return { nodesCount: nodes.length, propertiesCount };
}

/**
 * @typedef {Object} DataDictionaryTableProps
 * @property {string} [dictionaryName]
 * @property {Object[]} [dictionaryNodes]
 * @property {?string} [highlightingNodeID]
 * @property {(id: string) => void} [onExpandNode]
 */

/**
 * A component presenting an overview of the types in a dictionary organized by category
 * @param {DataDictionaryTableProps} props
 */
function DataDictionaryTable({
  dictionaryName = '',
  dictionaryNodes,
  highlightingNodeID,
  onExpandNode,
}) {
  const { nodesCount, propertiesCount } = getNodePropertyCount(dictionaryNodes);
  return (
    <>
      <p>
        {`${
          dictionaryName === '' ? 'Dictionary' : `${dictionaryName} dictionary`
        } has ${nodesCount} nodes and ${propertiesCount} properties`}
      </p>
      {Object.entries(category2NodeList(dictionaryNodes)).map(
        ([category, nodes]) => (
          <DataDictionaryCategory
            key={category}
            nodes={nodes}
            category={category}
            highlightingNodeID={highlightingNodeID}
            onExpandNode={onExpandNode}
          />
        )
      )}
    </>
  );
}

DataDictionaryTable.propTypes = {
  dictionaryName: PropTypes.string,
  dictionaryNodes: PropTypes.arrayOf(PropTypes.object),
  highlightingNodeID: PropTypes.string,
  onExpandNode: PropTypes.func,
};

export default DataDictionaryTable;
