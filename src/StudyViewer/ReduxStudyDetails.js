import { connect } from 'react-redux';
import StudyDetails from './StudyDetails';


const ReduxStudyDetails = (() => {
  const mapStateToProps = state => ({
    user: state.user,
  });


  return connect(mapStateToProps)(StudyDetails);
})();

export default ReduxStudyDetails;
