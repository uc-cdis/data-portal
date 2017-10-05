import React from 'react';
import { Link } from 'react-router';

import { Table, TableData, TableRow, TableHead } from '../theme';
import { app } from '../localconf';


const subHeader = (function () {
  let message = 'This is a user-friendly interface for accessing the Data Dictionary';

  if (app === 'edc') {
    message = 'The data dictionary viewer is a user-friendly interface for accessing the Environmental Data Commons Data Dictionary.';
  } else if (app === 'bpa') {
    message = 'The BPA data dictionary viewer is a user-friendly interface for accessing the BPA Data Dictionary.';
  } else if (app === 'bhc') {
    message = 'The data dictionary viewer is a user-friendly interface for accessing the Data Dictionary used by the Brain Commons.';
  }
  return message;
}());

const TableBullet = ({ node, description }) => (
  <TableRow>
    <TableData>
      <Link to={`/dd/${node}`}> {node} </Link>
    </TableData>
    <TableData right>
      {description}
    </TableData>
  </TableRow>
);


const CategoryTable = ({ nodes, category }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableData first_cr>
          {category}
        </TableData>
      </TableRow>
    </TableHead>

    <tbody>
      {
        nodes.map(
          node => <TableBullet node={node.id} key={node.id} description={node.description} />
        )
      }
    </tbody>
  </Table>
);


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
    id => id.charAt(0) !== '_' && id === dictionary[id].id
  ).map(
    id => dictionary[id]
  ).filter(
    node => node.category && node.id
  ).reduce(
    (lookup, node) => {
      if (!lookup[node.category]) { lookup[node.category] = []; }
      lookup[node.category].push(node);
      return lookup;
    }, {}
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
    <div>
      <h3> Data Dictionary Viewer </h3>
      <p>{subHeader}</p>
      <Link to={'/dd/graph'}> Explore dictionary as a graph </Link>
      {Object.keys(c2nl).map(category =>
        <CategoryTable key={category} nodes={c2nl[category]} category={category} />)}
    </div>
  );
};

export default DataDictionary;
