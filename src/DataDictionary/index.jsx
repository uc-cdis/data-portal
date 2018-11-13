import { connect } from 'react-redux';
import DataDictionary from './DataDictionary';

const setGraphView = isGraphView => ({
  type: 'GRAPH_TABLE_VIEW',
  isGraphView,
});

const ReduxDataDictionary = (() => {
  const mapStateToProps = state => ({
    isGraphView: state.ddgraph.isGraphView,
  });

  const mapDispatchToProps = dispatch => ({
    onSetGraphView: (isGraphView) => dispatch(setGraphView(isGraphView)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionary);
})();

export default ReduxDataDictionary;