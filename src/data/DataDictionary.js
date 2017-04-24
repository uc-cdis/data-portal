import React from 'react'
import Nav from './nav.js'
import {Box, cube} from '../theme.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';

const Table = styled.table`
	position: relative;
	border: 0;
	* {
		box-sizing: border-box;
  	}
  	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-box-align: stretch;
	-ms-flex-align: stretch;
	align-items: stretch;
	width: 100%;
	border-collapse: collapse;
	overflow: auto;
	-webkit-box-shadow: 0 0 6px rgba(0,0,0,0.5);
	box-shadow:0 0 6px rgba(0,0,0,0.5);
	margin: 1em;
`;

const TableHead = styled.thead`
	background: #847c7c
	color: white
	display: -webkit-box;
	display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		text-align: left;
		padding: 5px 5px;
		
`;

 const TableRow = styled.tr`
 	padding: 0rem 0rem;
    color: #222;
    border-bottom: 1px solid rgba(0,0,0,0.065);
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    display: block;
    font-size: 1.3rem;
    width: 100%;
 `;

 const TableData = styled.td`
    width: ${props => props.right ? '80%' : '20%'};
    display: inline-block;
    padding: 0.5rem 1rem;
    overflow: scroll;
    
 `;


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
			{category}	
			</tr>
		</TableHead>

		<tbody>
			{nodes.map( (node) => <TableBullet node={node} description={dictionary[node]["description"]}/> )}
		</tbody>
	</Table>
 )
}


const DataDictionaryViewer = ({submission}) =>{
	let filterCategories = (dictionary, node_types) =>{
		let categories = {}
		for(let node in node_types){
			let category = dictionary[node_types[node]]["category"]
			
			if(categories.hasOwnProperty(category)){
				console.log(categories[category])
				categories[category].push(node_types[node]) 
			}
			else{
				categories[category] = [node_types[node]]
			}
		}
		console.log(categories)
		return categories
	}
	let categories = filterCategories(submission.dictionary, submission.node_types)
	return (
	<Box>
		<Nav />
		<h3> Data Dictionary Viewer </h3>
		<p>The BPA data dictionary viewer is a user-friendly interface for accessing the BPA Data Dictionary.</p>
		 {Object.keys(categories).map( (category) =>
          <CategoryTable dictionary={submission.dictionary} nodes={categories[category]} category = {category}/> )}

		
	</Box>

 )
}

const mapStateToProps = (state)=> {return {
	'submission': state.submission,
}};

const mapDispatchToProps = (dispatch) => ({
  
});

const DataDictionary = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryViewer);
export default DataDictionary