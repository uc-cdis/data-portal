import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import StudyRegistration from './StudyRegistration';
import { StudyRegistrationConfig } from './StudyRegistrationConfig';
import { loadStudiesFromMDS } from '../Discovery/MDSUtils';

const StudyRegistrationWithMDSBackend: React.FC<{
    user: any,
    userAuthMapping: any,
    config: StudyRegistrationConfig,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  useEffect(() => {
    loadStudiesFromMDS('unregistered_discovery_metadata').then((rawStudies) => {
      setStudies(rawStudies);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, []);

  return (
    <StudyRegistration
      studies={studies === null ? [] : studies}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
  ...state.studyRegistration,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(StudyRegistrationWithMDSBackend);
