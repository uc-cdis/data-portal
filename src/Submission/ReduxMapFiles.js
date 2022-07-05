import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { receiveFilesToMap } from '../redux/submission/slice';

/** @typedef {import('../redux/types').RootState} RootState */

const ReduxMapFiles = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    unmappedFiles: state.submission.unmappedFiles,
  });

  /** @param {import('../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {RootState['submission']['filesToMap']} files */
    mapSelectedFiles: (files) => {
      dispatch(receiveFilesToMap(files));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
