import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Typography,
  Space,
  Result,
  Radio,
} from 'antd';
import { Link, useLocation } from 'react-router-dom';

import './StudyRegistration.css';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import {
  hostname, requestorPath, useArboristUI, studyRegistrationConfig, kayakoConfig,
} from '../localconf';
import { FormSubmissionState, StudyRegistrationProps } from './StudyRegistration';
import { createKayakoTicket } from '../utils';
import { fetchWithCreds } from '../actions';

const { TextArea } = Input;
const { Text } = Typography;

const KAYAKO_MAX_SUBJECT_LENGTH = 255;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 32,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
};
/* eslint-enable no-template-curly-in-string */

interface LocationState {
  studyUID?: string|Number;
  studyNumber?: string;
  studyName?: string;
  studyRegistrationAuthZ?: string;
}

const StudyRegistrationRequestForm: React.FunctionComponent<StudyRegistrationProps> = (props: StudyRegistrationProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  // const [requestID, setRequestID] = useState<string|undefined|null>(null);
  const [studyNumber, setStudyNumber] = useState<string|undefined|null>(null);
  const [studyName, setStudyName] = useState<string|undefined|null>(null);
  const [studyUID, setStudyUID] = useState<string|Number|undefined|null>(null);
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<string|undefined|null>(null);
  const [role, setRole] = useState('Principal Investigator');
  const [formSubmissionButtonDisabled, setFormSubmissionButtonDisabled] = useState(false);
  const [reqAccessRequestPending, setReqAccessRequestPending] = useState(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
    setStudyRegistrationAuthZ(locationStateData.studyRegistrationAuthZ);
  }, [location.state]);

  useEffect(() => form.resetFields(), [studyNumber, studyName, form]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('create', 'kayako', '/kayako', props.userAuthMapping));
  };

  const handleRegisterFormSubmission = (formValues) => {
    // create a request in requestor
    const body = {
      username: props.user.username,
      resource_id: studyUID,
      resource_paths: [studyRegistrationAuthZ, '/mds_gateway', '/cedar'],
      role_ids: ['study_registrant', 'mds_user', 'cedar_user'],
    };
    fetchWithCreds({
      path: `${requestorPath}request`,
      method: 'POST',
      body: JSON.stringify(body),
    }).then(
      ({ data, status }) => {
        if (status === 201) {
          if (data && data.request_id) {
            // request created, now create a kayako ticket
            const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
            const email = formValues['E-mail Address'];
            let subject = `Registration Access Request for ${studyNumber} ${studyName}`;
            if (subject.length > KAYAKO_MAX_SUBJECT_LENGTH) {
              subject = `${subject.substring(0, KAYAKO_MAX_SUBJECT_LENGTH - 3)}...`;
            }

            let contents = `Request ID: ${data.request_id}\nGrant Number: ${studyNumber}\nStudy Name: ${studyName}\nEnvironment: ${hostname}`;

            Object.entries(formValues).filter(([key]) => !key.includes('_doNotInclude')).forEach((entry) => {
              const [key, value] = entry;
              contents = contents.concat(`\n${key}: ${value}`);
            });
            createKayakoTicket(subject, fullName, email, contents, kayakoConfig?.kayakoDepartmentId).then(() => setFormSubmissionStatus({ status: 'success' }),
              (err) => setFormSubmissionStatus({ status: 'error', text: err.message }));
          } else {
            // eslint-disable-next-line no-console
            console.error('Requestor returns 201 but no request_id in payload body'); // shouldn't get here
          }
        } else if (status === 409) {
          // there is already a request for this user on this study, display a message and disable the button
          setFormSubmissionButtonDisabled(true);
          setFormSubmissionStatus({ status: 'warning', text: 'There is already a pending request for this study/user combination, please wait while we are processing your request.' });
        } else {
          // something has gone wrong
          setFormSubmissionStatus({ status: 'error', text: `Failed to create a request with error code: ${status}. Please try again later. If the error persists, please contact us for help.` });
        }
        setReqAccessRequestPending(false);
      },
    );
  };

  const onFinish = (values) => {
    setReqAccessRequestPending(true);
    handleRegisterFormSubmission(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onRadioChange = (e) => {
    setRole(e.target.value);
  };

  if (formSubmissionStatus) {
    return (
      <div className='study-reg-container'>
        <div className='study-reg-form-container'>
          {(formSubmissionStatus.status === 'success') ? (
            <Result
              status={formSubmissionStatus.status}
              title='Your access request has been submitted!'
              subTitle='Thank you for your submission. Requests take up to 1 business day to complete. You will be notified of the status.'
              extra={[
                <Link key='discovery' to={'/discovery'}>
                  <Button>Go To Discovery Page</Button>
                </Link>,
              ]}
            />
          ) : (
            <Result
              status={formSubmissionStatus.status}
              title='A problem has occurred during submitting the request!'
              subTitle={formSubmissionStatus.text}
              extra={[
                <Button type='primary' key='close' onClick={() => { setFormSubmissionStatus(null); setReqAccessRequestPending(false); }}>
                  Close
                </Button>,
              ]}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form} name='study-reg-request-form' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>Study Registration Access Request</Divider>
          <Typography style={{ textAlign: 'center' }}>
            Please fill out this form to request and be approved for access to register your study with the HEAL Platform.
          </Typography>
          <Divider plain />
          <div className='study-reg-exp-text'><Text type='danger'>*</Text><Text type='secondary'> Indicates required fields</Text></div>
          <Form.Item
            label='Study Name - Grant Number'
            name='Study Grant_doNotInclude'
            initialValue={(!studyName && !studyNumber) ? '' : `${studyName || 'N/A'} - ${studyNumber || 'N/A'}`}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea disabled autoSize />
          </Form.Item>
          <Form.Item
            name='First Name'
            label='Registrant First Name'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='Last Name'
            label='Registrant Last Name'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='E-mail Address'
            label='E-mail Address'
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail',
              },
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='Affiliated Institution'
            label='Affiliated Institution'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Role on Project'
            name='Role on Project'
            initialValue={role}
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Radio.Group onChange={onRadioChange} value={role}>
              <Space direction='vertical'>
                <Radio value={'Principal Investigator'}>Principal Investigator</Radio>
                <Radio value={'Co-Principal Investigator'}>Co-Principal Investigator</Radio>
                <Radio value={'Co-Investigator'}>Co-Investigator</Radio>
                <Radio value={'Administrator'}>Administrator</Radio>
                <Radio value={'Clinical Collaborator'}>Clinical Collaborator</Radio>
                <Radio value={'Clinical Coordinator'}>Clinical Coordinator</Radio>
                <Radio value={'Data Analyst'}>Data Analyst</Radio>
                <Radio value={'Data Manager'}>Data Manager</Radio>
                <Radio value={'Research Coordinator'}>Research Coordinator</Radio>
                <Radio value={'Other'}>
                  Other...
                  {role === 'Other' ? (
                    <Form.Item
                      name='Custom Role'
                      noStyle
                      rules={[{ required: true, message: 'Please provide a role' }]}
                    >
                      <Input style={{ width: 200, marginLeft: 8 }} />
                    </Form.Item>
                  ) : null}
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              {(!userHasAccess()) ? (
                <Tooltip title={'You don\'t have permission to request for access to study registration'}>
                  <Button type='primary' htmlType='submit' disabled>
                    Submit
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' htmlType='submit' disabled={reqAccessRequestPending || formSubmissionButtonDisabled} loading={reqAccessRequestPending}>
                  Submit
                </Button>
              )}
              <Button htmlType='button' onClick={onReset} disabled={reqAccessRequestPending}>
                Reset
              </Button>
            </Space>
          </Form.Item>
          { (studyRegistrationConfig.studyRegistrationFormDisclaimerField)
              && (
                <Typography className='study-reg-disclaimer-text'>
                  {studyRegistrationConfig.studyRegistrationFormDisclaimerField}
                </Typography>
              )}
        </Form>
      </div>
    </div>
  );
};

export default StudyRegistrationRequestForm;
