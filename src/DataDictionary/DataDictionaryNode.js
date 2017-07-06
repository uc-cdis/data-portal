import React from 'react'
import Nav from '../Nav/component.js'
import {Box, cube, Table, TableData, TableRow, TableHead, Bullet} from '../theme.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';

const LinkBullet = ({link})=>{
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


const LinkTable = ({links, node}) =>{
  let fields = ['Name', 'Required', 'Label']
  return(
  <Table>
    <TableHead>
      <TableRow>
      {fields.map((field, i) =>
              <TableData first_cr key={i}>{field}</TableData>)}
      </TableRow>
    </TableHead>

    <tbody>
      {links.map( (link, i) => <LinkBullet key={i} link={link} /> )}
    </tbody>
  </Table>
 )
}

const getType = ( schema ) => {
  if ('type' in schema) {
    if (typeof schema.type == 'string'){
      return schema.type;
    }
    else {
      return schema.type.join(', ');
    }
  }
  else if ('enum' in schema) {
    return schema.enum.join(', ');
  }
}

const NodeTable = ({node}) => {
  return(
  <Table>
    <TableRow>
      <TableData first_cr> Title </TableData>
      <TableData right>{ node['title'] }</TableData>
    </TableRow>

    <TableRow>
      <TableData first_cr> Category </TableData>
      <TableData right>{ node['category']}</TableData>
    </TableRow>

    <TableRow>
      <TableData first_cr> Description </TableData>
      <TableData right>{ node['description']}</TableData>
    </TableRow>

    <TableRow>
      <TableData first_cr> Unique Keys </TableData>
      <TableData right>{
        <ul>
        {node['uniqueKeys'].map( (key, i) => <Bullet key={i}>{key.join(', ')}</Bullet> )} 
        </ul>
      }</TableData>
    </TableRow>

    <tbody></tbody>
  </Table>
  )
}
const Required = styled(TableData)`
`;
const Col1 = styled(TableData)`
  width: 35%;
`;
const Col2 = styled(TableData)`
  width: 15%;
`;
const Col3 = styled(TableData)`
  width: 10%;
`;
const Col4 = styled(TableData)`
  width: 40%;
`;

class CollapsibleList extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.items.length > 5) {
      this.state = {
        collapsed: 1
      }
    } else {
      this.state = {
        collapsed: 0
      }
    }
  }
  render() {
    if (this.state.collapsed == 1) {
      return (
        <div>
          {this.props.items.slice(0, 3).map((item) => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => this.state.collapsed = 2}>{"More options"}</a>
        </div>
      );
    } else if (this.state.collapsed == 2) {
      return (
        <div>
          {this.props.items.map((item) => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => this.state.collapsed = 1}>{"Fewer options"}</a>
        </div>
      );
    } else {
      return (
        <div>
          {this.props.items.map((item) => <Bullet key={item}>{item}</Bullet>)}
        </div>
      );
    }
  }
}

const PropertyBullet = ({property_name, property, required}) =>{
  let description = 'No Description';
  if ('description' in property){
    description = property.description;
  }
  if ('term' in property){
    description = property.term.description;
  }

  let type = getType(property);
  if (type == undefined){
    if ('oneOf' in property){
      type = property['oneOf'].map((item, i) => getType(item)).join(', ');
    }
  }

  return(
    <TableRow>
      <Col1><div> { property_name }</div> </Col1>
      <Col2> <ul>{ (type.indexOf(',') == -1) ? type : <CollapsibleList items={type.split(', ')}/>} </ul></Col2>
      <Col3> { required ? "Yes" : "No" } </Col3>
      <Col4> { description } </Col4>
    </TableRow>
  )
}

const PropertiesTable = ({node, required, links}) =>{
  let properties_fields = ['Property','Type','Required', 'Description']
  let linknames = links.map((link, i) => link['name']);
  let properties = Object.keys(node['properties'])
  return(
    <Table>
      <TableHead>
        <TableRow>
          <Col1 first_cr>Property</Col1>
          <Col2 first_cr>Type</Col2>
          <Col3 first_cr>Required</Col3>
          <Col4 first_cr>Description</Col4>
        </TableRow>
      </TableHead>

      <tbody>
        {
        properties.map( (property, i) =>
          (! linknames.includes(property)) &&
          <PropertyBullet key={i} required={required.includes(property)} property_name={property} property={node['properties'][property]}/>
         )
        }

      </tbody>
    </Table>

  )
}

const DataDictionaryNodeType = ({params,submission}) =>{
  let node = params.node
  let dictionary = submission.dictionary
  let links = [];
  let required = ('required' in dictionary[node]) ? dictionary[node].required : [];
  for (var link of submission.dictionary[node].links){
    if (link.name != undefined){
        links.push(link);
    }
    else {
      links = links.concat(link['subgroup']);
    }
  }
  return (
  <Box>
    <Nav />
    <h3> {node} </h3>
    <Link to='/dd'>{'< top level dictionary'}</Link> 

    <h4> Summary </h4>
      <NodeTable node={dictionary[node]} > </NodeTable>

    <h4> Links </h4>
      <LinkTable links={links} node = {node} />

    <h4> Properties </h4>
      <PropertiesTable links={links} required={required} node ={dictionary[node]} >  </PropertiesTable>

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
