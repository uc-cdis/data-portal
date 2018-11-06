import { connect } from 'react-redux';
import DataDictionaryTable from './DataDictionaryTable';

const mapStateToProps = state => ({
  dictionary: state.submission.dictionary,
});

const mapDispatchToProps = () => ({
});

const ReduxDataDictionaryTable = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryTable);
export default ReduxDataDictionaryTable;
