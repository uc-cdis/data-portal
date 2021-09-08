import { connect } from 'react-redux';
import GqlEditor from './GqlEditor';

const mapStateToProps = (state, ownProps) => {
  const searchParams = new URLSearchParams(ownProps.location.search);

  return {
    schema: state.graphiql.schema,
    guppySchema: state.graphiql.guppySchema,
    endpointIndex: searchParams.has('endpoint')
      ? parseInt(searchParams.get('endpoint'), 10)
      : null,
  };
};

const mapDispatchToProps = () => ({});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
