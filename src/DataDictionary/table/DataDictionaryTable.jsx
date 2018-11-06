import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../utils';
import './DataDictionaryTable.less';

const TableBullet = ({ node, description }) => (
  <tr className='data-dictionary-table__row'>
    <td className='data-dictionary-table__data'>
      <Link to={`/dd/${node.id}`}> {node.title} </Link>
    </td>
    <td className='data-dictionary-table__data data-dictionary-table__data--right'>
      {description}
    </td>
  </tr>
);

TableBullet.propTypes = {
  node: PropTypes.object.isRequired,
  description: PropTypes.string,
};

TableBullet.defaultProps = {
  description: '',
};

const CategoryTable = ({ nodes, category }) => (
  <table className='data-dictionary-table'>
    <thead className='data-dictionary-table__head'>
      <tr className='data-dictionary-table__row'>
        <td className='data-dictionary-table__data data-dictionary-table__data--head'>
          {capitalizeFirstLetter(category)}
        </td>
      </tr>
    </thead>

    <tbody>
      {
        nodes.map(
          node => (<TableBullet
            node={node}
            key={node.id}
            description={node.description}
          />),
        )
      }
    </tbody>
  </table>
);

CategoryTable.propTypes = {
  category: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
  return Object.keys(dictionary).filter(
    id => id.charAt(0) !== '_' && id === dictionary[id].id,
  ).map(
    id => dictionary[id],
  ).filter(
    node => node.category && node.id,
  )
    .reduce(
      (lookup, node) => {
        if (!lookup[node.category]) { lookup[node.category] = []; }
        lookup[node.category].push(node);
        return lookup;
      }, {},
    );
}
/* eslint-enable no-param-reassign */

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionaryTable = ({ dictionary }) => {
  const c2nl = category2NodeList(dictionary);

  return (
    <React.Fragment>
      {Object.keys(c2nl).map(category =>
        <CategoryTable key={category} nodes={c2nl[category]} category={category} />)}
    </React.Fragment>
  );
};

DataDictionaryTable.propTypes = {
  dictionary: PropTypes.object,
};

DataDictionaryTable.defaultProps = {
  dictionary: {},
};

export default DataDictionaryTable;
