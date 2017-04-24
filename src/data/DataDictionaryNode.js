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
    background: ${props => props.first_cr ? '#847c7c': 'white' };
    color: ${props=> props.first_cr ? 'white' : '#222'};
    display: inline-block;
    padding: 0.5rem 1rem;
    overflow: scroll;
    
 `;

const LinkBullet = ({link, description})=>{
	let required = link.required == true ? 'Yes':'No'
	return(
		<TableRow> 

		<TableData>
			<Link to={'/dd/' + link.target_type }> {link.name} </Link>
		</TableData>

		<TableData>
			{required}
		</TableData>

		<TableData>
			{link.label}
		</TableData>

		</TableRow>
 )
}


const NodeTable = ({dictionary, node, fields}) =>{
	let links = dictionary[node].links
	return(
	<Table>
		<TableHead>
			<tr>
			{fields.map((field, i) =>
          		<TableData first_cr key={i}>{field}</TableData>)}
			</tr>
		</TableHead>

		<tbody>
			{links.map( (link, i) => <LinkBullet key={i} link={link} description={dictionary[node]["description"]}/> )}
		</tbody>
	</Table>
 )
}

const LinkTable = ({node, dictionary}) => {
	return(
	<Table> 
		<TableRow>
			<TableData first_cr> Type </TableData>
			<TableData right>{ dictionary[node]['type']}</TableData>
		</TableRow>

		<TableRow>
			<TableData first_cr> Category </TableData>
			<TableData right>{ dictionary[node]['category']}</TableData>
		</TableRow>

		<TableRow>
			<TableData first_cr> Description </TableData>
			<TableData right>{ dictionary[node]['description']}</TableData>
		</TableRow>

		<TableRow>
			<TableData first_cr> Unique Keys </TableData>
			<TableData right>{ 
				<ul>
				{dictionary[node]['uniqueKeys'].map( (key, i) => <li key={i}>{key}</li> )} 
				</ul>
			}</TableData>
		</TableRow>

		<tbody></tbody>
	</Table>
	)
}

const DataDictionaryNodeType = ({params,submission}) =>{
	let node = params.node
	let dictionary = submission.dictionary
	let properties_fields = ['Property','Type',]
	let links_fields = ['Name', 'Required?', 'Label']
	
	return (
	<Box>
		<Nav />
		<h3> {node} </h3>

		<h4> Summary </h4>
			<LinkTable node={node} dictionary={dictionary} > </LinkTable>

		<h4> Links </h4>
			<NodeTable dictionary={dictionary} node = {node} fields={links_fields} />

		<h4> Properties </h4>
			<Table> 
					<TableHead>
						<tr>
						{properties_fields.map((field, i) =>
          				<TableData first_cr key={i}>{field}</TableData> )}
						
						</tr>
					</TableHead>

					<tbody>
						{
						Object.keys(dictionary[node]['properties']).map( (property, i) => 
						<TableRow key={i}> 	
							<TableData> {property} </TableData>
							<TableData> {dictionary[node]['properties'][property]['type']} </TableData>
						</TableRow> )	
						}

					</tbody>
				</Table>
		
	</Box>

 )
}

const mapStateToProps = (state)=> {return {
	'submission': state.submission,
}};

const mapDispatchToProps = (dispatch) => ({
  
});

const DataDictionaryNode = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryNodeType);
export default DataDictionaryNode