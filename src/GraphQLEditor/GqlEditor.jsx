import React, { useState } from 'react';
import GraphiQL from 'graphiql';
import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import Spinner from '../components/Spinner';
import { headers, graphqlPath, guppyGraphQLUrl } from '../localconf';
import './GqlEditor.less';
import 'graphiql/graphiql.css';

const parameters = {};
const defaultValue = 0;

function editQuery(newQuery) {
  parameters.query = newQuery;
}

function editVariables(newVariables) {
  parameters.variables = newVariables;
}

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

function GqlEditor({ schema, guppySchema, endpointIndex = defaultValue }) {
  if (!schema) {
    return <Spinner />; // loading
  }

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
    endpointIndex !== null && endpointIndex < options.length
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
      />
    </div>
  );
}

GqlEditor.propTypes = {
  schema: PropTypes.object,
  guppySchema: PropTypes.object,
  endpointIndex: PropTypes.number,
};

export default GqlEditor;
