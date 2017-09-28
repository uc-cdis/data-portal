import React from 'react';
import Nav from '../Nav/component';
import { Box, cube, Table, TableData, TableRow, TableHead } from '../theme';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as constants from './constants';
import { Link } from 'react-router';

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


const CategoryTable = ({ dictionary, nodes, category }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableData first_cr>
          {category}
        </TableData>
      </TableRow>
    </TableHead>

    <tbody>
      {nodes.map(node => <TableBullet node={node} key={node} description={dictionary[node].description} />)}
    </tbody>
  </Table>
);

const DataDictionaryViewer = ({ submission }) => {
  const filterCategories = (dictionary, node_types) => {
    const categories = {};
    for (const node in node_types) {
      const category = dictionary[node_types[node]].category;
      if (category == undefined) {
        continue;
      }
      if (categories.hasOwnProperty(category)) {
        categories[category].push(node_types[node]);
      } else {
        categories[category] = [node_types[node]];
      }
    }
    return categories;
  };
  const categories = filterCategories(submission.dictionary, submission.node_types);
  return (
    <div>
      <h3> Data Dictionary Viewer </h3>
      <p>{constants.subHeader}</p>
      <Link to={'/dd/graph'}> Explore dictionary as a graph </Link>
      {Object.keys(categories).map(category =>
        <CategoryTable dictionary={submission.dictionary} key={category} nodes={categories[category]} category={category} />)}
    </div>
  );
};

const mapStateToProps = state => ({
  submission: state.submission,
});

const mapDispatchToProps = dispatch => ({
});

const DataDictionary = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryViewer);
export default DataDictionary;
