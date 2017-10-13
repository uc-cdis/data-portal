import { connect } from 'react-redux';

import { graphqlSchemaUrl } from '../localconf';
import { fetchJsonOrText, connectionError } from '../actions';
import GqlEditor from './GqlEditor';


/**
 * Fetch the schema for graphi, and stuff it into redux -
 * handled by router
 */
export const fetchSchema = dispatch => fetchJsonOrText({ path: graphqlSchemaUrl, dispatch })
  .then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        return dispatch(
          {
            type: 'RECEIVE_SCHEMA_LOGIN',
            schema: data,
          },
        );
      }
    },
  );


const mapStateToProps = state => ({
  schema: state.graphiql.schema,
});

const mapDispatchToProps = dispatch => ({
});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
