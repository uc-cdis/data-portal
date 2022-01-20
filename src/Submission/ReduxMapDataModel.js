import { connect } from 'react-redux';
import MapDataModel from './MapDataModel';
import { getProjectsList } from './relayer';

const ReduxMapDataModel = (() => {
  /** @param {{ submission: import('./types').SubmissionState }} state */
  const mapStateToProps = (state) => ({
    filesToMap: state.submission.filesToMap,
    projects: state.submission.projectsByName,
    nodeTypes: state.submission.nodeTypes,
    dictionary: state.submission.dictionary,
  });

  /** @param {import('redux-thunk').ThunkDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    getProjectsList: () => {
      dispatch(getProjectsList());
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapDataModel);
})();

export default ReduxMapDataModel;
