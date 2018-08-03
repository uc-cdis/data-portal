import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { app } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import './DataDictionary.less';

const subHeader = (() => {
  let message = 'This is a user-friendly interface for accessing the Data IcoDictionary';

  if (app === 'edc') {
    message = 'The data dictionary viewer is a user-friendly interface for accessing the Environmental Data Commons Data IcoDictionary.';
  } else if (app === 'bpa') {
    message = 'The BPA data dictionary viewer is a user-friendly interface for accessing the BPA Data IcoDictionary.';
  } else if (app === 'bhc') {
    message = 'The data dictionary viewer is a user-friendly interface for accessing the Data IcoDictionary used by the Brain Commons.';
  }
  return message;
})();

const TableBullet = ({ node, description }) => (
  <tr className="data-dictionary__table-row">
    <td className="data-dictionary__table-data">
      <Link to={`/dd/${node.id}`}> {node.title} </Link>
    </td>
    <td className="data-dictionary__table-data data-dictionary__table-data--right">
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
  <table className="data-dictionary__table">
    <thead className="data-dictionary__table-head">
      <tr className="data-dictionary__table-row">
        <td className="data-dictionary__table-data data-dictionary__table-data--head">
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

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionary = ({ dictionary }) => {
  const c2nl = category2NodeList(dictionary);

  return (
    <div style={{ padding: '40px 0px' }}>
      <div className="h3-typo"> Data Dictionary Viewer </div>
      <p>{subHeader}</p>
      <Link to={'/dd/graph'} className="h3-typo">Explore dictionary as a graph</Link>
      {Object.keys(c2nl).map(category =>
        <CategoryTable key={category} nodes={c2nl[category]} category={category} />)}
    </div>
  );
};

export default DataDictionary;
