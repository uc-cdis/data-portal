import { connect } from 'react-redux';
import { setGraphView } from '../redux/ddgraph/slice';
import DataDictionary from './DataDictionary';

const ReduxDataDictionary = (() => {
  /** @param {import('../redux/types').RootState} state */
  const mapStateToProps = (state) => ({
    isGraphView: state.ddgraph.isGraphView,
    layoutInitialized: state.ddgraph.layoutInitialized,
    ...state.versionInfo,
  });

  /** @param {import('../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onSetGraphView: (isGraphView) => {
      dispatch(setGraphView(isGraphView));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionary);
})();

export default ReduxDataDictionary;
