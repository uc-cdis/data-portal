import React from 'react';
import { connect } from 'react-redux';

import StudyRegistration from './StudyRegistration';
import { StudyRegistrationConfig } from './StudyRegistrationConfig';

const StudyRegistrationWithMDSBackend: React.FC<{
    user: any,
    userAuthMapping: any,
    config: StudyRegistrationConfig,
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

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(StudyRegistrationWithMDSBackend);
