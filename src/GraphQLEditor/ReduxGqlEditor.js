import { connect } from 'react-redux';
import querystring from 'querystring';
import GqlEditor from './GqlEditor';


const mapStateToProps = (state, ownProps) => {
  const params = querystring.parse(ownProps.location.search ? ownProps.location.search.replace(/^\?+/, '') : '');
  return ({
    schema: state.graphiql.schema,
    endpointIndex: params && params.endpoint ? parseInt(params.endpoint, 10) : null,
  });
};

const mapDispatchToProps = () => ({
});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
