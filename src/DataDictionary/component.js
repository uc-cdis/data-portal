import React from 'react'
import Nav from '../Nav/component.js'
import {Box, cube, Table, TableData, TableRow, TableHead} from '../theme.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as constants from "./constants";
import { Link } from 'react-router';
import { BoxWithNavAndTimeout } from '../component';

const TableBullet = ({node, description})=>{
  return(
    <TableRow>
    <TableData>
      <Link to={'/dd/' + node }> {node} </Link>
    </TableData>
    <TableData right>
      {description}
    </TableData>
    </TableRow>
 )
}


const CategoryTable = ({dictionary, nodes, category}) =>{
  return(
  <Table>
    <TableHead>
      <tr>
        <td>
        {category}
        </td>
      </tr>
    </TableHead>

    <tbody>
      {nodes.map( (node) => <TableBullet node={node} key={node} description={dictionary[node]["description"]}/> )}
    </tbody>
  </Table>
 )
}

const DataDictionaryViewer = ({submission}) =>{
  let filterCategories = (dictionary, node_types) =>{
    let categories = {}
    for(let node in node_types){
      let category = dictionary[node_types[node]]["category"]
      if (category == undefined){
        continue;
      }
      if(categories.hasOwnProperty(category)){
        categories[category].push(node_types[node])
      }
      else{
        categories[category] = [node_types[node]]
      }
    }
    return categories
  }
  let categories = filterCategories(submission.dictionary, submission.node_types);
  return (
    <BoxWithNavAndTimeout>
      <h3> Data Dictionary Viewer </h3>
      <p>{constants.subHeader}</p>
      {Object.keys(categories).map((category) =>
        <CategoryTable dictionary={submission.dictionary} key={category} nodes={categories[category]} category = {category}/> )}
    </BoxWithNavAndTimeout>
  )
}

const mapStateToProps = (state)=> {return {
  'submission': state.submission,
}};

const mapDispatchToProps = (dispatch) => ({
});

const DataDictionary = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryViewer);
export default DataDictionary
