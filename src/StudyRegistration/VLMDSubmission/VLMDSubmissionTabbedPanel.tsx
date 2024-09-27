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
    disableCDESubmissionForm: boolean
}

export interface VLMDSubmissionProps {
    studyUID?: string | Number;
    studyNumber?: string;
    studyName?: string;
    studyRegistrationAuthZ?: string;
    userHasAccessToSubmit: boolean;
    disableCDESubmissionForm: boolean;
}

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
  const [disableCDESubmissionForm, setDisableCDESubmissionForm] = useState<boolean>(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
    setStudyRegistrationAuthZ(locationStateData.studyRegistrationAuthZ);
    setDisableCDESubmissionForm(locationStateData.disableCDESubmissionForm);
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
    disableCDESubmissionForm,
  };

  return (
    <Tabs
      className='vlmd-sub-tab-panel'
      centered
      items={[
        {
          label: 'Submit DD',
          key: 'dd-sub',
          children: DataDictionarySubmission(vlmdSubmissionProps),
        },
        {
          label: 'Submit CDE',
          key: 'cde-sub',
          children: CDESubmission(vlmdSubmissionProps),
        },
      ]}
    />
  );
};

export default VLMDSubmissionTabbedPanel;
