import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import { Table, TableData, TableRow, TableHead, Bullet } from '../theme';
import { assignNodePositions, createNodesAndEdges } from '../DataModelGraph/utils';
import { createFullGraph, createAbridgedGraph } from './GraphCreator';
import ToggleButton from '../DataModelGraph/ToggleButton';


const LinkBullet = ({ link }) => {
  const required = link.required ? 'Yes' : 'No';
  return (
    <TableRow>
      <TableData>
        <Link to={`/dd/${link.target_type}`}> {link.name} </Link>
      </TableData>
      <TableData>
        {required}
      </TableData>
      <TableData>
        {link.label}
      </TableData>
    </TableRow>
  );
};


const LinkTable = ({ links, node }) => {
  const fields = ['Name', 'Required', 'Label'];
  return (
    <Table>
      <TableHead>
        <TableRow>
          {fields.map((field, i) =>
            <TableData first_cr key={i}>{field}</TableData>)}
        </TableRow>
      </TableHead>

      <tbody>
        {links.map((link, i) => <LinkBullet key={i} link={link} />)}
      </tbody>
    </Table>
  );
};

const getType = (schema) => {
  if ('type' in schema) {
    if (typeof schema.type === 'string') {
      return schema.type;
    }

    return schema.type.join(', ');
  } else if ('enum' in schema) {
    return schema.enum.join(', ');
  }
  return undefined;
};

const NodeTable = ({ node }) => (
  <Table>
    <tbody>
      <TableRow>
        <TableData first_cr> Title </TableData>
        <TableData right>{ node.title }</TableData>
      </TableRow>

      <TableRow>
        <TableData first_cr> Category </TableData>
        <TableData right>{ node.category}</TableData>
      </TableRow>

      <TableRow>
        <TableData first_cr> Description </TableData>
        <TableData right>{ node.description}</TableData>
      </TableRow>

      <TableRow>
        <TableData first_cr> Unique Keys </TableData>
        <TableData right>{
          <ul>
            {node.uniqueKeys.map((key, i) => <Bullet key={i}>{key.join(', ')}</Bullet>)}
          </ul>
        }</TableData>

      </TableRow>
    </tbody>
  </Table>
);
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
    this.state = {
      collapsed: (props.items.length > 5) ? 1 : 0,
    };
  }

  render() {
    if (this.state.collapsed === 1) {
      return (
        <div>
          {this.props.items.slice(0, 3).map(item => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => { this.state.collapsed = 2; }}>{'More options'}</a>
        </div>
      );
    } else if (this.state.collapsed === 2) {
      return (
        <div>
          {this.props.items.map(item => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => { this.state.collapsed = 1; }}>{'Fewer options'}</a>
        </div>
      );
    }
    return (
      <div>
        {this.props.items.map(item => <Bullet key={item}>{item}</Bullet>)}
      </div>
    );
  }
}

const PropertyBullet = ({ property_name, property, required }) => {
  let description = 'No Description';
  if ('description' in property) {
    description = property.description;
  }
  if ('term' in property) {
    description = property.term.description;
  }

  let type = getType(property);
  if (!type) {
    if ('oneOf' in property) {
      type = property.oneOf.map((item) => getType(item)).join(', ');
    }
  }

  return (
    <TableRow>
      <Col1><div> { property_name }</div> </Col1>
      <Col2> <ul>{ (type.indexOf(',') === -1) ? type : <CollapsibleList items={type.split(', ')} />} </ul></Col2>
      <Col3> { required ? 'Yes' : 'No' } </Col3>
      <Col4> { description } </Col4>
    </TableRow>
  );
};

const PropertiesTable = ({ node, required, links }) => {
  const properties_fields = ['Property', 'Type', 'Required', 'Description'];
  const linknames = links.map(link => link.name);
  const properties = Object.keys(node.properties);
  return (
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
          properties.map((property, i) =>
            (!linknames.includes(property)) &&
            <PropertyBullet key={i} required={required.includes(property)} property_name={property} property={node.properties[property]} />,
          )
        }

      </tbody>
    </Table>

  );
};


/**
 * Component handles rendering of dictionary types as a node graph
 */
class DictionaryGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      full_toggle: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.full_toggle) {
      createFullGraph(this.props.nodes, this.props.edges);
    } else {
      if (document.getElementById('table_wrapper') !== null) {
        document.getElementById('table_wrapper').remove();
      }
      createAbridgedGraph(this.props.nodes, this.props.edges);
    }
  }
  componentDidUpdate() {
    if (this.state.full_toggle) {
      createFullGraph(this.props.nodes, this.props.edges);
    } else {
      if (document.getElementById('table_wrapper') !== null) {
        document.getElementById('table_wrapper').remove();
      }
      createAbridgedGraph(this.props.nodes, this.props.edges);
    }
  }
  handleClick() {
    this.setState(prevState => ({
      full_toggle: !prevState.full_toggle,
    }));
  }
  render() {
    const nodes = this.props.nodes;
    const edges = this.props.edges;

    const divStyle = {
      width: 'inherit',
      backgroundColor: '#f4f4f4',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
    };
    // Note: svg#data_model_graph is popuplated by createFull|AbridedGraph above
    return (
      <div>
        <Link to={'/dd'}> Explore dictionary as a table </Link>
        <p style={{ fontSize: '75%', marginTop: '1em' }}> <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}> Bold, italicized</span> properties are required</p>
        <div style={divStyle} id="graph_wrapper">
          <svg id="data_model_graph" />
          <ToggleButton id="toggle_button" onClick={this.handleClick}>Toggle view</ToggleButton>
        </div>
      </div>
    );
  }
}


/**
 * Component renders a view with details of a particular dictionary type (node - /dd/typename) or
 * of the whole dictionary (/dd/graph)
 * 
 * @param {*} param0 
 */
const DataDictionaryNode = ({ params, submission }) => {
  const node = params.node;
  const dictionary = submission.dictionary;

  if (node === 'graph') {
    const { nodes, edges } = createNodesAndEdges(submission, true, []);
    assignNodePositions(nodes, edges, { numPerRow: 3 });

    return (
      <div>
        <h3> Data Dictionary Graph Viewer </h3>
        <DictionaryGraph nodes={nodes} edges={edges} dictionary={dictionary} />
      </div>
    );
  }

  let links = [];
  const required = ('required' in dictionary[node]) ? dictionary[node].required : [];
  if (submission.dictionary[node].links) {
    submission.dictionary[node].links.forEach(
      (link) => {
        if (link.name) {
          links.push(link);
        } else if (link.subgroup) {
          links = links.concat(link.subgroup);
        }
      }
    );
  }

  return (
    <div>
      <h3> {node} </h3>
      <Link to="/dd">{'< top level dictionary'}</Link>

      <h4> Summary </h4>
      <NodeTable node={dictionary[node]} />

      <h4> Links </h4>
      <LinkTable links={links} node={node} />

      <h4> Properties </h4>
      <PropertiesTable links={links} required={required} node={dictionary[node]} />
    </div>
  );
};


export default DataDictionaryNode;

