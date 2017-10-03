import { connect } from 'react-redux';
import DataDictionary from './DataDictionary';

const mapStateToProps = state => ({
  dictionary: state.submission.dictionary,
});

const mapDispatchToProps = () => ({
});

const ReduxDataDictionary = connect(mapStateToProps, mapDispatchToProps)(DataDictionary);
export default ReduxDataDictionary;
