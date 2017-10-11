import React from 'react';
import Nav from '../Nav/component';
import { cube, Table, TableData, TableRow, TableHead, Bullet } from '../theme';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';
import { button } from '../theme';
import { createNodesAndEdges } from '../utils';
import { createFullGraph, create_abridged_graph } from './GraphCreator';
import { ToggleButton } from '../DataModelGraph/component';

const LinkBullet = ({ link }) => {
  const required = link.required == true ? 'Yes' : 'No';
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
};

const NodeTable = ({ node }) => (
  <Table>
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

    <tbody />
  </Table>
);
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
    this.state = {
      collapsed: (props.items.length > 5) ? 1 : 0,
    };
  }

  render() {
    if (this.state.collapsed === 1) {
      return (
        <div>
          {this.props.items.slice(0, 3).map(item => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => this.state.collapsed = 2}>{'More options'}</a>
        </div>
      );
    } else if (this.state.collapsed === 2) {
      return (
        <div>
          {this.props.items.map(item => <Bullet key={item}>{item}</Bullet>)}
          <a href="#/" onClick={() => this.state.collapsed = 1}>{'Fewer options'}</a>
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
  if (type === undefined) {
    if ('oneOf' in property) {
      type = property.oneOf.map((item, i) => getType(item)).join(', ');
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
  const linknames = links.map((link, i) => link.name);
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
            (! linknames.includes(property)) &&
            <PropertyBullet key={i} required={required.includes(property)} property_name={property} property={node.properties[property]} />,
          )
        }

      </tbody>
    </Table>

  );
};

const DataDictionaryNodeType = ({ params, submission }) => {
  const node = params.node;
  const dictionary = submission.dictionary;

  if (node === 'graph') {
    const nodes_and_edges = createNodesAndEdges(submission, true, []);
    const nodes = nodes_and_edges.nodes;
    const edges = nodes_and_edges.edges;

    return (
      <div>
        <h3> Data Dictionary Graph Viewer </h3>
        <CreateGraph nodes={nodes} edges={edges} dictionary={dictionary} />
      </div>
    );
  }

  let links = [];
  const required = ('required' in dictionary[node]) ? dictionary[node].required : [];
  for (const link of submission.dictionary[node].links) {
    if (link.name !== undefined) {
      links.push(link);
    } else {
      links = links.concat(link.subgroup);
    }
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

class CreateGraph extends React.Component {
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
      create_abridged_graph(this.props.nodes, this.props.edges);
    }
  }
  componentDidUpdate() {
    if (this.state.full_toggle) {
      createFullGraph(this.props.nodes, this.props.edges);
    } else {
      if (document.getElementById('table_wrapper') !== null) {
        document.getElementById('table_wrapper').remove();
      }
      create_abridged_graph(this.props.nodes, this.props.edges);
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

    const root = 'program';
    const queue = [];
    const layout = [];
    const placed = [];
    let layout_level = 0;

    queue.push(root);
    layout.push([root]);
    while (queue.length !== 0) {
      const query = queue.shift(); // breadth first
      for (let i = 0; i < edges.length; i++) {
        if (edges[i].target === query || edges[i].target.name === query) {
          if (!layout[layout_level + 1]) {
            layout[layout_level + 1] = [];
          }
          queue.push(edges[i].source);
          if ((layout[layout_level + 1].indexOf(edges[i].source) === -1) && (placed.indexOf(edges[i].source) == -1)) {
            if (layout[layout_level + 1].length >= 3) {
              layout_level += 1;
              if (!layout[layout_level + 1]) {
                layout[layout_level + 1] = [];
              }
            }
            layout[layout_level + 1].push(edges[i].source);
            placed.push(edges[i].source);
          }
        }
      }
      placed.push(query);
    }

    for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        for (let k = 0; k < nodes.length; k++) {
          if (nodes[k].name === layout[i][j]) {
            nodes[k].position = [(j + 1) / (layout[i].length + 1), (i + 1) / (layout.length + 1)];
            nodes[k].position_index = [j, i];
            break;
          }
        }
      }
    }

    const divStyle = {
      width: 'inherit',
      backgroundColor: '#f4f4f4',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
    };
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

const mapStateToProps = state => ({
  submission: state.submission,
});

const mapDispatchToProps = dispatch => ({
});

const DataDictionaryNode = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryNodeType);
export default DataDictionaryNode;
