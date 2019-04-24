import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';
import Button from '@gen3/ui-component/dist/components/Button';
import React from 'react';
import PropTypes from 'prop-types';
import { fetchGraphQL, fetchFlatGraphQL } from '../actions';
import Spinner from '../components/Spinner';
import { config } from '../params';
import './GqlEditor.less';

const parameters = {};
const defaultValue = config.dataExplorerConfig ? 1 : 0;

class GqlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEndpointIndex: props.endpointIndex,
    };
  }

  componentDidMount() {
    if (this.props.endpointIndex && this.state.selectedEndpointIndex !== this.props.endpointIndex) {
      this.selectEndpoint(this.props.endpointIndex);
    }
  }

  getOtherIndex = index =>
    +!index // will either return 0 or 1

  selectEndpoint = (index) => {
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

    const options = [
      {
        name: 'Graph Model',
        endpoint: fetchGraphQL,
        schema: graphqlSchema,
      },
    ];

    if (config.dataExplorerConfig) {
      options.push({
        name: 'Flat Model',
        endpoint: fetchFlatGraphQL,
        schema: null,
      });
    }

    // If provided endpoint is not 0 or 1, default to 0 (graph model)
    const index = this.state.selectedEndpointIndex !== null &&
      this.state.selectedEndpointIndex < options.length ?
      this.state.selectedEndpointIndex
      : defaultValue;

    return (
      <div className='gql-editor' id='graphiql'>
        <div className='gql-editor__header'>
          <h2 className='gql-editor__title'>Query graph</h2>
          {
            options.length > 1 ? (
              <div className='gql-editor__button'>
                <Button
                  onClick={() => this.selectEndpoint(this.getOtherIndex(index))}
                  label={`Switch to ${options[this.getOtherIndex(index)].name}`}
                  buttonType='primary'
                />
              </div>
            ) : null
          }
        </div>
        {
          index === 0 ?
            <GraphiQL
              fetcher={options[index].endpoint}
              query={parameters.query}
              schema={options[index].schema}
              variables={parameters.variables}
              onEditQuery={editQuery}
              onEditVariables={editVariables}
            />
            :
            <GraphiQL
              fetcher={options[index].endpoint}
              query={parameters.query}
              variables={parameters.variables}
              onEditQuery={editQuery}
              onEditVariables={editVariables}
            />
        }
      </div>
    );
  }
}


GqlEditor.propTypes = {
  schema: PropTypes.object.isRequired,
  endpointIndex: PropTypes.number,
};

GqlEditor.defaultProps = {
  endpointIndex: defaultValue,
};

export default GqlEditor;
