import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';

const ReduxSubmissionHeader = (() => {
  /** @param {{ submission: import('./types').SubmissionState }} state */
  const mapStateToProps = (state) => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
  });

  return connect(mapStateToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
