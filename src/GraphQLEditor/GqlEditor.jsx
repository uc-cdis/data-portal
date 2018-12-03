import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
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

    const buttons = [
      {
        name: 'Graph Model',
        endpoint: fetchGraphQL,
        schema: graphqlSchema,
      },
      {
        name: 'Flat Model',
        endpoint: fetchArrangerGraphQL,
        schema: null,
      }
    ];

    return (
      <div>
        <div className='gql-editor__button'>
        <Dropdown>
          <Dropdown.Button>Select Endpoint</Dropdown.Button>
            <Dropdown.Menu>
              {
                buttons.map((button, i) => {
                  return (
                    <Dropdown.Item
                      key={i}
                      className={this.state.selectedEndpointIndex === i ? 'gql-editor__button--active' : ''}
                      onClick={() => this.selectEndpoint(i)}
                    >
                      {button.name}
                    </Dropdown.Item>
                  )
                })
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='gql-editor' id='graphiql'>
          <h2 className='gql-editor__title'>Query graph</h2>
          <GraphiQL
            fetcher={buttons[this.state.selectedEndpointIndex].endpoint}
            schema={buttons[this.state.selectedEndpointIndex].schema}
            query={parameters.query}
            variables={parameters.variables}
            onEditQuery={editQuery}
            onEditVariables={editVariables}
          />
        </div>
      </div>
    );
  }
};


GqlEditor.propTypes = {
  schema: PropTypes.object.isRequired,
  endpointIndex: PropTypes.number,
};

GqlEditor.defaultProps = {
  endpointIndex: 0,
};

export default GqlEditor;
