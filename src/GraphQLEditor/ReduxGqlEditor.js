import { connect } from 'react-redux';
import GqlEditor from './GqlEditor';

const mapStateToProps = (state, ownProps) => {
  const endpoint = new URLSearchParams(ownProps.location.search).get('endpoint');

  return ({
    schema: state.graphiql.schema,
    endpointIndex: endpoint ? parseInt(endpoint, 10) : null,
  });
};

const mapDispatchToProps = () => ({
});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
