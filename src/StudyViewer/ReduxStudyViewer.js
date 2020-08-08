import { connect } from 'react-redux';
import StudyViewer from './StudyViewer';


const ReduxStudyViewer = (() => {
  const mapStateToProps = state => ({
    user: state.user,
  });


  return connect(mapStateToProps)(StudyViewer);
})();

export default ReduxStudyViewer;
