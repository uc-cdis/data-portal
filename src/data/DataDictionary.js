import React from 'react'
import Nav from './nav.js'
import {Box, cube} from '../theme.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';
import ReactTable from 'react-table';

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
`;

const Category = styled.thead`
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

const TableBullet = ({})=>{
	return(
		<div> bullet </div>
 )
}


const CategoryTable = ({dictionary, node_types, categories}) =>{
	return(
	<Table>
		<Category>
			<tr>
			Category	
			</tr>
		</Category>

		<tbody>
			{<TableBullet/>}
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
		return categories
	}
	return (
	<Box>
		<Nav />
		<h3> Data Dictionary Viewer </h3>
		<CategoryTable dictionary={submission.dictionary} node_types={submission.node_types} categories = {filterCategories(submission.dictionary, submission.node_types)}/>
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