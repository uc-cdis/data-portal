import React from 'react';
import GraphiQL from 'graphiql';
import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import Spinner from '../components/Spinner';
import { headers, graphqlPath, guppyGraphQLUrl } from '../localconf';
import './GqlEditor.less';
import 'graphiql/graphiql.css';

const parameters = {};
const defaultValue = 0;

const fetchGraphQL = (graphQLParams) =>
  fetch(graphqlPath, {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });

const fetchFlatGraphQL = (graphQLParams) =>
  fetch(guppyGraphQLUrl, {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });

class GqlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEndpointIndex: props.endpointIndex,
    };
  }

  componentDidMount() {
    if (
      this.props.endpointIndex &&
      this.state.selectedEndpointIndex !== this.props.endpointIndex
    ) {
      this.selectEndpoint(this.props.endpointIndex);
    }
  }

  getOtherIndex = (index) => +!index; // will either return 0 or 1

  selectEndpoint = (index) => {
    this.setState({ selectedEndpointIndex: index });
  };

  render() {
    if (!this.props.schema) {
      return <Spinner />; // loading
    }
    const editQuery = (newQuery) => {
      parameters.query = newQuery;
    };
    const editVariables = (newVariables) => {
      parameters.variables = newVariables;
    };

    const options = [
      {
        name: 'Flat Model',
        endpoint: fetchFlatGraphQL,
        schema: this.props.guppySchema,
      },
      {
        name: 'Graph Model',
        endpoint: fetchGraphQL,
        schema: this.props.schema,
      },
    ];

    // If provided endpoint is not 0 or 1, default to 0 (flat model)
    const index =
      this.state.selectedEndpointIndex !== null &&
      this.state.selectedEndpointIndex < options.length
        ? this.state.selectedEndpointIndex
        : defaultValue;

    return (
      <div className='gql-editor' id='graphiql'>
        <div className='gql-editor__header'>
          <h2 className='gql-editor__title'>Query graph</h2>
          {options.length > 1 ? (
            <div className='gql-editor__button'>
              <Button
                onClick={() => this.selectEndpoint(this.getOtherIndex(index))}
                label={`Switch to ${options[this.getOtherIndex(index)].name}`}
                buttonType='primary'
              />
            </div>
          ) : null}
        </div>
        <GraphiQL
          fetcher={options[index].endpoint}
          query={parameters.query}
          schema={options[index].schema}
          variables={parameters.variables}
          onEditQuery={editQuery}
          onEditVariables={editVariables}
        />
      </div>
    );
  }
}

GqlEditor.propTypes = {
  schema: PropTypes.object,
  guppySchema: PropTypes.object,
  endpointIndex: PropTypes.number,
};

GqlEditor.defaultProps = {
  endpointIndex: defaultValue,
};

export default GqlEditor;
