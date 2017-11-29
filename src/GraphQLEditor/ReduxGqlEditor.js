import { connect } from 'react-redux';

import GqlEditor from './GqlEditor';



const mapStateToProps = state => ({
  schema: state.graphiql.schema,
});

const mapDispatchToProps = dispatch => ({
});

const ReduxGqlEditor = connect(mapStateToProps, mapDispatchToProps)(GqlEditor);
export default ReduxGqlEditor;
