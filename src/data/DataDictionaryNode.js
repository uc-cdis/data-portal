import React from 'react'
import Nav from './nav.js'
import {Box, cube, Table, TableData, TableRow, TableHead} from '../theme.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';

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


const LinkTable = ({dictionary, node}) =>{
	let fields = ['Name', 'Required?', 'Label']
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

const NodeTable = ({node, dictionary}) => {
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

const PropertyBullet = ({dictionary, property, node}) =>{
	let description =  dictionary[node]['properties'][property]['description']
	if (typeof description == 'undefined') {
 		if(typeof dictionary[node]['properties'][property]['term'] != 'undefined'){
 			description = dictionary[node]['properties'][property]['term']['description']
 		}else{
 			description = 'No Description'
 		}
	}
	return(
		<TableRow> 	
			<TableData> {property} </TableData>
			<TableData> {dictionary[node]['properties'][property]['type']} </TableData>
			<TableData> { description } </TableData>
		</TableRow>
	)
}

const PropertiesTable = ({dictionary, node}) =>{
	let properties_fields = ['Property','Type','Description']
	let properties = Object.keys(dictionary[node]['properties'])
	return(
		<Table> 
			<TableHead>
				<tr>
				{properties_fields.map((field, i) =>
  				<TableData first_cr key={i}>{field}</TableData> )}
				
				</tr>
			</TableHead>

			<tbody>
				{
				properties.map( (property, i) =>
					<PropertyBullet key={i} dictionary={dictionary} property={property} node ={node} /> 
				 )	
				}

			</tbody>
		</Table>

	
	)
}

const DataDictionaryNodeType = ({params,submission}) =>{
	let node = params.node
	let dictionary = submission.dictionary
	
	return (
	<Box>
		<Nav />
		<h3> {node} </h3>

		<h4> Summary </h4>
			<NodeTable node={node} dictionary={dictionary} > </NodeTable>

		<h4> Links </h4>
			<LinkTable dictionary={dictionary} node = {node} />

		<h4> Properties </h4>
			<PropertiesTable dictionary={dictionary}  node ={node} >  </PropertiesTable>
		
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