import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DictionaryGraph from './DictionaryGraph';
import './DataDictionary.less';

const LinkBullet = ({ link }) => {
  const required = link.required ? 'Yes' : 'No';
  return (
    <tr className="data-dictionary__table-row">
      <td className="data-dictionary__table-data">
        <Link to={`/dd/${link.target_type}`}> {link.name} </Link>
      </td>
      <td className="data-dictionary__table-data">
        {required}
      </td>
      <td className="data-dictionary__table-data">
        {link.label}
      </td>
    </tr>
  );
};

LinkBullet.propTypes = {
  link: PropTypes.shape(
    {
      target_type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    },
  ).isRequired,
};

const LinkTable = ({ links }) => {
  const fields = ['Name', 'Required', 'Label'];
  return (
    <table className="data-dictionary__table">
      <thead className="data-dictionary__table-head">
        <tr className="data-dictionary__table-row">
          {fields.map(field =>
            <td className="data-dictionary__table-data data-dictionary__table-data--head" key={field}>{field}</td>)}
        </tr>
      </thead>

      <tbody>
        {links.map(link => <LinkBullet key={link.name} link={link} />)}
      </tbody>
    </table>
  );
};

LinkTable.propTypes = {
  links: PropTypes.array.isRequired,
};

/**
 * Little helper to extract the type for some dictionary node property.
 * Export just for testing.
 * @param {Object} property one of the properties of a dictionary node
 * @return {String|Array<String>} string for scalar types, array for enums
 *                   and other listish types or 'UNDEFINED' if no
 *                   type information availabale
 */
export const getType = (property) => {
  let type = 'UNDEFINED';
  if ('type' in property) {
    if (typeof property.type === 'string') {
      type = property.type;
    } else {
      type = property.type;
    }
  } else if ('enum' in property) {
    type = property.enum;
  } else if ('oneOf' in property) {
    // oneOf has nested type list - we want to flatten nested enums out here ...
    type = property.oneOf
      .map(item => getType(item))
      .reduce(
        (flatList, it) => {
          if (Array.isArray(it)) {
            return flatList.concat(it);
          }
          flatList.push(it);
          return flatList;
        }, [],
      );
  } else {
    type = 'UNDEFINED';
  }

  return type;
};

const NodeTable = ({ node }) => (
  <table className="data-dictionary__table">
    <tbody>
      <tr className="data-dictionary__table-row">
        <td className="data-dictionary__table-data data-dictionary__table-data--head"> Id </td>
        <td className="data-dictionary__table-data data-dictionary__table-data--right">{ node.id }</td>
      </tr>

      <tr className="data-dictionary__table-row">
        <td className="data-dictionary__table-data data-dictionary__table-data--head"> Category </td>
        <td className="data-dictionary__table-data data-dictionary__table-data--right">{ node.category}</td>
      </tr>

      <tr className="data-dictionary__table-row">
        <td className="data-dictionary__table-data data-dictionary__table-data--head"> Description </td>
        <td className="data-dictionary__table-data data-dictionary__table-data--right">{ node.description}</td>
      </tr>

      <tr className="data-dictionary__table-row">
        <td className="data-dictionary__table-data data-dictionary__table-data--head"> Unique Keys </td>
        <td className="data-dictionary__table-data data-dictionary__table-data--right">
          {
            <ul>
              {
                node.uniqueKeys.map(
                  (key) => {
                    const compoundKey = key.join(', ');
                    return <li className="data-dictionary__bullet" key={compoundKey}>{compoundKey}</li>;
                  },
                )
              }
            </ul>
          }
        </td>
      </tr>
    </tbody>
  </table>
);

NodeTable.propTypes = {
  node: PropTypes.object.isRequired,
};

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
          {this.props.items.slice(0, 3).map(item => <li className="data-dictionary__bullet" key={item}>{item}</li>)}
          <a href="#/" onClick={() => { this.state.collapsed = 2; }}>{'More options'}</a>
        </div>
      );
    } else if (this.state.collapsed === 2) {
      return (
        <div>
          {this.props.items.map(item => <li className="data-dictionary__bullet" key={item}>{item}</li>)}
          <a href="#/" onClick={() => { this.state.collapsed = 1; }}>{'Fewer options'}</a>
        </div>
      );
    }
    return (
      <div>
        {this.props.items.map(item => <li className="data-dictionary__bullet" key={item}>{item}</li>)}
      </div>
    );
  }
}

CollapsibleList.propTypes = {
  items: PropTypes.array.isRequired,
};

CollapsibleList.defaultProps = {
  items: [],
};

const PropertyBullet = (props) => {
  const { propertyName, property, required } = props;
  let description = 'No Description';
  if ('description' in property) {
    description = property.description;
  }
  if ('term' in property) {
    description = property.term.description;
  }

  const type = getType(property);

  return (
    <tr className="data-dictionary__table-row">
      <td className="data-dictionary__table-data data-dictionary__table-data--column-1"><div> { propertyName }</div> </td>
      <td className="data-dictionary__table-data data-dictionary__table-data--column-2"> <ul>{ (typeof type === 'string') ? type : <CollapsibleList items={type} />} </ul></td>
      <td className="data-dictionary__table-data data-dictionary__table-data--column-3"> { required ? 'Yes' : 'No' } </td>
      <td className="data-dictionary__table-data data-dictionary__table-data--column-4"> { description } </td>
    </tr>
  );
};

PropertyBullet.propTypes = {
  property: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
};

/**
 * Render tables of dictionary node type's properties
 * @param {node, required:boolean, links:Array} props
 */
export const PropertiesTable = ({ node, required, links }) => {
  const linknames = links.map(link => link.name);
  const properties = Object.keys(node.properties);
  return (
    <table className="data-dictionary__table">
      <thead className="data-dictionary__table-head">
        <tr className="data-dictionary__table-row">
          <td className="data-dictionary__table-data data-dictionary__table-data--column-1 data-dictionary__table-data--head">Property</td>
          <td className="data-dictionary__table-data data-dictionary__table-data--column-2 data-dictionary__table-data--head">Type</td>
          <td className="data-dictionary__table-data data-dictionary__table-data--column-3 data-dictionary__table-data--head">Required</td>
          <td className="data-dictionary__table-data data-dictionary__table-data--column-4 data-dictionary__table-data--head">Description</td>
        </tr>
      </thead>

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
    </table>

  );
};

PropertiesTable.propTypes = {
  node: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  required: PropTypes.bool.isRequired,
};


/**
 * Component renders a view with details of a particular dictionary type (node - /dd/typename) or
 * of the whole dictionary (/dd/graph).
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
        <DictionaryGraph
          dictionary={dictionary}
          counts_search={submission.counts_search}
          links_search={submission.links_search}
        />
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
      <h3> {dictionary[node].title} </h3>
      Download template: <a className="data-dictionary__download-button" href={`/api/v0/submission/template/${node}?format=json`}>{'JSON'}</a> | <a className="data-dictionary__download-button" href={`/api/v0/submission/template/${node}`}>{'TSV'}</a>


      <h4> Summary </h4>
      <NodeTable node={dictionary[node]} />

      <h4> Links </h4>
      <LinkTable links={links} node={node} />

      <h4> Properties </h4>
      <PropertiesTable links={links} required={required} node={dictionary[node]} />
    </div>
  );
};

DataDictionaryNode.propTypes = {
  params: PropTypes.shape({
    node: PropTypes.string.isRequired,
  }).isRequired,
  submission: PropTypes.shape(
    {
      counts_search: PropTypes.objectOf(PropTypes.number),
      dictionary: PropTypes.object.isRequired,
      links_search: PropTypes.objectOf(PropTypes.number),
    },
  ).isRequired,
};

export default DataDictionaryNode;

