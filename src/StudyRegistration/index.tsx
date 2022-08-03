import React from 'react';
import { connect } from 'react-redux';

import StudyRegistration from './StudyRegistration';

const StudyRegistrationWithMDSBackend: React.FC<{
    user: any,
    userAuthMapping: any,
}> = (props) => (
  <StudyRegistration
    {...props}
  />
);

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
  ...state.studyRegistration,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(StudyRegistrationWithMDSBackend);
