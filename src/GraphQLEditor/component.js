import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fetchGraphQL } from '../actions';
import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';

export const Title = styled.h2`
  display: inline-block;
  vertical-align: middle;
  margin: 15px 0px;
  margin-right: 0.5em;
`;

export const GraphBox = styled.div`
  height: 100vh;
`;


let parameters = {};

const ProjectSubmissionComponent = ({schema}) => {
  let graphqlSchema = buildClientSchema(schema.data);
  let editQuery = (newQuery) => {
    parameters.query = newQuery;
  };
  let editVariables = (newVariables) => {
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
          onEditVariables={editVariables} />
      </GraphBox>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    'schema': state.graphiql.schema
  }
};

const mapDispatchToProps = (dispatch) => ({
});

const GraphQLQuery = connect(mapStateToProps, mapDispatchToProps)(ProjectSubmissionComponent);
export default GraphQLQuery;
