import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataDictionarySubmission from './DataDictionarySubmission';
import CDESubmission from './CDESubmission';
import { StudyRegistrationProps } from '../StudyRegistration';
import { userHasMethodForServiceOnResource } from '../../authMappingUtils';
import { useArboristUI } from '../../localconf';

interface LocationState {
    studyUID?: string | Number;
    studyNumber?: string;
    studyName?: string;
    studyRegistrationAuthZ?: string;
}

export interface VLMDSubmissionProps {
    studyUID?: string | Number;
    studyNumber?: string;
    studyName?: string;
    studyRegistrationAuthZ?: string;
    userHasAccessToSubmit: boolean
}

export const KAYAKO_MAX_SUBJECT_LENGTH = 255;

export const FORM_LAYOUT = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 32,
  },
};

export const TAIL_LAYOUT = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

/* eslint-disable no-template-curly-in-string */
export const VALIDATE_MESSAGE = {
  required: '${label} is required',
};
/* eslint-enable no-template-curly-in-string */

const VLMDSubmissionTabbedPanel: React.FC<StudyRegistrationProps> = (props: StudyRegistrationProps) => {
  const location = useLocation();

  const [studyNumber, setStudyNumber] = useState<string | undefined>(undefined);
  const [studyName, setStudyName] = useState<string | undefined>(undefined);
  const [studyUID, setStudyUID] = useState<string | Number | undefined>(undefined);
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<string | undefined>(undefined);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
    setStudyRegistrationAuthZ(locationStateData.studyRegistrationAuthZ);
  }, [location.state]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('access', 'study_registration', studyRegistrationAuthZ, props.userAuthMapping)
    );
  };

  const vlmdSubmissionProps: VLMDSubmissionProps = {
    studyNumber,
    studyName,
    studyUID,
    studyRegistrationAuthZ,
    userHasAccessToSubmit: userHasAccess(),
  };

  return (
    <Tabs
      type='card'
      items={[
        {
          label: 'VLMD Submission',
          key: 'vlmd-sub',
          children: DataDictionarySubmission(vlmdSubmissionProps),
        },
        {
          label: 'CDE Submission',
          key: 'cde-sub',
          children: CDESubmission(vlmdSubmissionProps),
        },
      ]}
    />
  );
};

export default VLMDSubmissionTabbedPanel;
