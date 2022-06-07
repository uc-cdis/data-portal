import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphiQL from 'graphiql';
import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import Spinner from '../components/Spinner';
import { headers, graphqlPath, guppyGraphQLUrl } from '../localconf';
import './GqlEditor.css';
import 'graphiql/graphiql.css';

/** @typedef {import('graphiql').Fetcher} GraphiQLFetcher */
/** @typedef {import('graphql').GraphQLSchema} GraphQLSchema */

const parameters = {};
const defaultValue = 0;

/** @param {string} newQuery */
function editQuery(newQuery) {
  parameters.query = newQuery;
}

/** @param {string} newVariables */
function editVariables(newVariables) {
  parameters.variables = newVariables;
}

/** @type {GraphiQLFetcher} */
const fetchGraphQL = (graphQLParams) =>
  fetch(graphqlPath, {
    credentials: 'include',
    headers,
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

/** @type {GraphiQLFetcher} */
const fetchFlatGraphQL = (graphQLParams) =>
  fetch(guppyGraphQLUrl, {
    credentials: 'include',
    headers,
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

/**
 * @param {Object} props
 * @param {GraphQLSchema} [props.guppySchema]
 * @param {GraphQLSchema} [props.schema]
 */
function GqlEditor({ guppySchema, schema }) {
  if (!schema) {
    return <Spinner />; // loading
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const endpointIndex = Number.parseInt(searchParams.get('endpoint'), 10);

  const options = [
    {
      name: 'Flat Model',
      fetcher: fetchFlatGraphQL,
      schema: guppySchema,
    },
    {
      name: 'Graph Model',
      fetcher: fetchGraphQL,
      schema,
    },
  ];

  // If provided endpoint index is not 0 or 1, default to 0 (flat model)
  const initialIndex =
    !Number.isNaN(endpointIndex) && endpointIndex < options.length
      ? endpointIndex
      : defaultValue;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const otherIndex = +!currentIndex; // will either return 0 or 1

  return (
    <div className='gql-editor' id='graphiql'>
      <div className='gql-editor__header'>
        <h2 className='gql-editor__title'>Query graph</h2>
        {options.length > 1 ? (
          <div className='gql-editor__button'>
            <Button
              onClick={() => setCurrentIndex(otherIndex)}
              label={`Switch to ${options[otherIndex].name}`}
              buttonType='primary'
            />
          </div>
        ) : null}
      </div>
      <GraphiQL
        fetcher={options[currentIndex].fetcher}
        query={parameters.query}
        schema={options[currentIndex].schema}
        variables={parameters.variables}
        onEditQuery={editQuery}
        onEditVariables={editVariables}
        storage={window.sessionStorage}
      />
    </div>
  );
}

GqlEditor.propTypes = {
  guppySchema: PropTypes.any,
  schema: PropTypes.any,
};

export default GqlEditor;
