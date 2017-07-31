import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { BoxWithNavAndTimeout } from '../component';
import { fetchGraphQL } from '../actions';
import GraphiQL from 'graphiql';
import { buildClientSchema } from 'graphql/utilities';

export const Title = styled.h2`
  display: inline-block;
  vertical-align: middle;
  margin: 15px 0px;
  margin-right: 0.5em;
`;

let graphqlSchema = buildClientSchema(require('../data/schema.json').data);
let parameters = {};

const ProjectSubmissionComponent = (props) => {
  let editQuery = (newQuery) => {
    parameters.query = newQuery;
  };
  let editVariables = (newVariables) => {
    parameters.variables = newVariables;
  };

  return (
    <BoxWithNavAndTimeout>
      <div id="graphiql">
        <Title>Query graph</Title>
        <GraphiQL
          fetcher={fetchGraphQL}
          schema={graphqlSchema}
          query={parameters.query}
          variables={parameters.variables}
          onEditQuery={editQuery}
          onEditVariables={editVariables} />
      </div>
    </BoxWithNavAndTimeout>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    'parameters': state.parameters
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const GraphQLQuery = connect(mapStateToProps, mapDispatchToProps)(ProjectSubmissionComponent);
export default GraphQLQuery;
