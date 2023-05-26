import { connect } from 'react-redux';
import DataDictionarySubmission from './DataDictionarySubmission';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxDataDictionarySubmission = connect(mapStateToProps)(DataDictionarySubmission);
export default ReduxDataDictionarySubmission;
