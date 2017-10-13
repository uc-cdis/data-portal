import React from 'react';
import styled from 'styled-components';
import { fetchGraphQL } from '../actions';
import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';
import Spinner from '../components/Spinner';

export const Title = styled.h2`
  display: inline-block;
  vertical-align: middle;
  margin: 15px 0px;
  margin-right: 0.5em;
`;

export const GraphBox = styled.div`
  height: 100vh;
`;


const parameters = {};

const GqlEditor = ({ schema }) => {
  if (! schema) {
    return <Spinner />; // loading
  }
  const graphqlSchema = buildClientSchema(schema.data);
  const editQuery = (newQuery) => {
    parameters.query = newQuery;
  };
  const editVariables = (newVariables) => {
    parameters.variables = newVariables;
  };

  return (
    <div>
      <GraphBox id="graphiql">
        <Title>Query graph</Title>
        <GraphiQL
          fetcher={fetchGraphQL}
          schema={graphqlSchema}
          query={parameters.query}
          variables={parameters.variables}
          onEditQuery={editQuery}
          onEditVariables={editVariables}
        />
      </GraphBox>
    </div>
  );
};

export default GqlEditor;
