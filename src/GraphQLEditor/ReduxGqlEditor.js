import { connect } from 'react-redux';
import queryString from 'query-string';
import GqlEditor from './GqlEditor';


const mapStateToProps = (state, ownProps) => {
  const params = queryString.parse(ownProps.location.search);

  return ({
    schema: state.graphiql.schema,
    endpointIndex: params && params.endpoint ? parseInt(params.endpoint, 10) : null,
  });
};

const mapDispatchToProps = () => ({
});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
