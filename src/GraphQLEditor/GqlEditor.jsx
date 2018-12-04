import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import React from 'react';
import PropTypes from 'prop-types';
import { fetchGraphQL, fetchArrangerGraphQL } from '../actions';
import Spinner from '../components/Spinner';
import './GqlEditor.less';

const parameters = {};

class GqlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEndpointIndex: props.endpointIndex || 0,
    };
  }

  selectEndpoint = index => {
    this.setState({ selectedEndpointIndex: index });
  }

  render() {
    if (!this.props.schema) {
      return <Spinner />; // loading
    }
    const graphqlSchema = buildClientSchema(this.props.schema.data);
    const editQuery = (newQuery) => {
      parameters.query = newQuery;
    };
    const editVariables = (newVariables) => {
      parameters.variables = newVariables;
    };

    const dropdownItems = [
      {
        name: 'Graph Model',
        endpoint: fetchGraphQL,
        schema: graphqlSchema,
      },
      {
        name: 'Flat Model',
        endpoint: fetchArrangerGraphQL,
        schema: null,
      },
    ];

    const index = this.state.selectedEndpointIndex < dropdownItems.length ? this.state.selectedEndpointIndex : 0;

    return (
      <div className='gql-editor' id='graphiql'>
        <div className='gql-editor__header'>
          <h2 className='gql-editor__title'>Query graph</h2>
          <div className='gql-editor__button'>
            <Dropdown>
              <Dropdown.Button>Select Endpoint</Dropdown.Button>
              <Dropdown.Menu>
                {
                  dropdownItems.map((item, i) => (
                    <Dropdown.Item
                      key={i}
                      className={index === i ? 'gql-editor__button--active' : ''}
                      onClick={() => this.selectEndpoint(i, dropdownItems.length)}
                    >
                      {item.name}
                    </Dropdown.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <GraphiQL
          fetcher={dropdownItems[index].endpoint}
          schema={dropdownItems[index].schema}
          query={parameters.query}
          variables={parameters.variables}
          onEditQuery={editQuery}
          onEditVariables={editVariables}
        />
      </div>
    );
  }
}


GqlEditor.propTypes = {
  schema: PropTypes.object.isRequired,
  endpointIndex: PropTypes.number,
};

GqlEditor.defaultProps = {
  endpointIndex: 0,
};

export default GqlEditor;
