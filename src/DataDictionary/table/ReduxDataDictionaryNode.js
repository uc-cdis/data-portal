import { connect } from 'react-redux';
import DataDictionaryNode from './DataDictionaryNode';


const mapStateToProps = state => ({
  submission: state.submission,
});

const mapDispatchToProps = () => ({
});

const ReduxDataDictionaryNode = connect(mapStateToProps, mapDispatchToProps)(DataDictionaryNode);
export default ReduxDataDictionaryNode;
