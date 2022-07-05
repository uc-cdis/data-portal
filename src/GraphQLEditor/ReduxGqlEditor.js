import { connect } from 'react-redux';
import GqlEditor from './GqlEditor';

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  schema: state.graphiql.schema,
  guppySchema: state.graphiql.guppySchema,
});

const ReduxGqlEditor = connect(mapStateToProps)(GqlEditor);
export default ReduxGqlEditor;
