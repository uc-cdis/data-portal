import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { Table, TableData, TableRow, TableHead, Bullet } from '../theme';
import DictionaryGraph from './DictionaryGraph';


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

LinkBullet.propTypes = {
  target_type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const LinkTable = ({ links }) => {
  const fields = ['Name', 'Required', 'Label'];
  return (
    <Table>
      <TableHead>
        <TableRow>
          {fields.map(field =>
            <TableData first_cr key={field}>{field}</TableData>)}
        </TableRow>
      </TableHead>

      <tbody>
        {links.map(link => <LinkBullet key={link.name} link={link} />)}
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

const PropertyBullet = (props) => {
  const { propertyName, property, required } = props;
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
      type = property.oneOf.map(item => getType(item)).join(', ');
    } else {
      type = 'UNDEFINED';
    }
  }

  return (
    <TableRow>
      <Col1><div> { propertyName }</div> </Col1>
      <Col2> <ul>{ (type.indexOf(',') === -1) ? type : <CollapsibleList items={type.split(', ')} />} </ul></Col2>
      <Col3> { required ? 'Yes' : 'No' } </Col3>
      <Col4> { description } </Col4>
    </TableRow>
  );
};

const PropertiesTable = ({ node, required, links }) => {
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
          properties.map(property =>
            (!linknames.includes(property)) &&
            <PropertyBullet
              key={property}
              required={required.includes(property)}
              propertyName={property}
              property={node.properties[property]}
            />,
          )
        }

      </tbody>
    </Table>

  );
};

const actionButton = css`
&:hover,
&:active,
&:focus {
  color: inherit;
}
`;

const DownloadButton = styled.a`
 ${actionButton};
`;


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
    return (
      <div>
        <h3> Data Dictionary Graph Viewer </h3>
        <DictionaryGraph dictionary={dictionary} counts_search={submission.counts_search} links_search={submission.links_search} />
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
      },
    );
  }

  return (
    <div>
      <Link to="/dd">{'< top level dictionary'}</Link>
      <h3> {node} </h3>
      Download template: <DownloadButton href={`/api/v0/submission/template/${node}?format=json`}>{'JSON'}</DownloadButton> | <DownloadButton href={`/api/v0/submission/template/${node}`}>{'TSV'}</DownloadButton>


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

