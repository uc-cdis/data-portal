import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';
import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import { fetchGraphQL, fetchArrangerGraphQL } from '../actions';
import Spinner from '../components/Spinner';
import './GqlEditor.less';

const parameters = {};

const GqlEditor = ({ schema, endpoint }) => {
  if (!schema) {
    return <Spinner />; // loading
  }
  const graphqlSchema = buildClientSchema(schema.data);
  const editQuery = (newQuery) => {
    parameters.query = newQuery;
  };
  const editVariables = (newVariables) => {
    parameters.variables = newVariables;
  };
  console.log('endpoint', endpoint);

  return (
    <div>
      <div className='gql-editor' id='graphiql'>
        <h2 className='gql-editor__title'>Query graph</h2>
        <GraphiQL
          fetcher={endpoint === 'arranger' ? fetchArrangerGraphQL : fetchGraphQL}
          schema={graphqlSchema}
          query={parameters.query}
          variables={parameters.variables}
          onEditQuery={editQuery}
          onEditVariables={editVariables}
        />
      </div>
    </div>
  );
};


GqlEditor.propTypes = {
  schema: PropTypes.object.isRequired,
};

export default GqlEditor;
