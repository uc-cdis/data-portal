import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Table, TableData, TableRow, TableHead } from '../theme';
import { app } from '../localconf';
import { capitalizeFirstLetter } from '../utils';


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
  <TableRow>
    <TableData>
      <Link to={`/dd/${node.id}`}> {node.title} </Link>
    </TableData>
    <TableData right>
      {description}
    </TableData>
  </TableRow>
);

TableBullet.propTypes = {
  node: PropTypes.object.isRequired,
  description: PropTypes.string,
};

TableBullet.defaultProps = {
  description: '',
};

const CategoryTable = ({ nodes, category }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableData first_cr>
          {capitalizeFirstLetter(category)}
        </TableData>
      </TableRow>
    </TableHead>

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
  </Table>
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
    <div style={{paddingBottom: "100px"}}>
      <h3> Data Dictionary Viewer </h3>
      <p>{subHeader}</p>
      <Link to={'/dd/graph'}> Explore dictionary as a graph </Link>
      {Object.keys(c2nl).map(category =>
        <CategoryTable key={category} nodes={c2nl[category]} category={category} />)}
    </div>
  );
};

export default DataDictionary;
