import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import {
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Typography,
  Space,
  Radio,
  message,
} from 'antd';
import { useLocation } from 'react-router-dom';
import { userHasMethodForServiceOnResource } from '../../authMappingUtils';
import {
  hostname, requestorPath, useArboristUI, studyRegistrationConfig, kayakoConfig,
} from '../../localconf';
import { FormSubmissionState, StudyRegistrationProps } from '../StudyRegistration';
import { createKayakoTicket } from '../../utils';
import { fetchWithCreds } from '../../actions';
import { doesUserHaveRequestPending } from '../utils';
import { determineFormText, layout, tailLayout } from './FormLayoutConstants';
import FormSubmissionUI from './FormSubmissionUI';
import '../StudyRegistration.css';


const { TextArea } = Input;
const { Text } = Typography;

const KAYAKO_MAX_SUBJECT_LENGTH = 255;


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
  const [studyNumber, setStudyNumber] = useState<string|undefined|null>(null);
  const [studyName, setStudyName] = useState<string|undefined|null>(null);
  const [studyUID, setStudyUID] = useState<string|Number|undefined|null>(null);
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<string|undefined|null>(null);
  const [role, setRole] = useState('Principal Investigator');
  const [formSubmissionButtonDisabled, setFormSubmissionButtonDisabled] = useState(false);
  const [reqAccessRequestPending, setReqAccessRequestPending] = useState(false);
  const formText = determineFormText(location.pathname);

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
    return (userHasMethodForServiceOnResource('create', 'kayako', '/kayako',
     props.userAuthMapping));
  };

  const handleRegisterFormSubmission = async (formValues) => {
    // first, check if there is already a pending request in requestor
    try {
      const userHaveRequestPending = await doesUserHaveRequestPending(studyUID);
      if (userHaveRequestPending) {
      // there is already a request for this user on this study, display a message
      // and disable the button
        setFormSubmissionButtonDisabled(true);
        setFormSubmissionStatus({
          status: 'info',
          text: `There is already a pending request for this study/user combination,
           please wait while we are processing your request.`
         });
        return;
      }
    } catch (err) {
      message.warning(`Unable to check existing requests: ${err}`);
    }

    // create a request in requestor
    const body = {
      username: props.user.username,
      resource_id: studyUID,
      resource_paths: [studyRegistrationAuthZ, '/mds_gateway', '/cedar'],
      role_ids: ['study_registrant', 'mds_user', 'cedar_user'],
    };
    // deepcode ignore Ssrf: studyUID is pulled in from setState into request body,
    // not as URL
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
        } else {
          // something has gone wrong
          setFormSubmissionStatus({ status: 'error', text: `Failed to create a request with error code: ${status}. Please try again later. If the error persists, please contact us for help.` });
        }
        setReqAccessRequestPending(false);
      },
    ).catch(() => setFormSubmissionStatus({ status: 'error', text: 'Failed to create a request. Please try again later. If the error persists, please contact us for help.' }));
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
    return <FormSubmissionUI
      formSubmissionStatus={formSubmissionStatus}
      setFormSubmissionStatus={setFormSubmissionStatus}
      setReqAccessRequestPending={setReqAccessRequestPending}
      />
  }

  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form}
          name='study-reg-request-form' onFinish={onFinish}
          validateMessages={validateMessages}>
          <Divider plain>{formText.title}</Divider>
          <Typography style={{ textAlign: 'center' }}>
            {formText.description}
          </Typography>
          <Divider plain />
          <div className='study-reg-exp-text'>
            <Text type='danger'>*</Text>
            <Text type='secondary'> Indicates required fields</Text>
          </div>
          <Form.Item
            label='Study Name - Grant Number'
            name='Study Grant_doNotInclude'
            initialValue={(!studyName && !studyNumber) ?
              '' : `${studyName || 'N/A'} - ${studyNumber || 'N/A'}`}
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
                <Tooltip title={`You don't have permission to
                  request for access to study registration`}>
                  <Button type='primary' htmlType='submit' disabled>
                    Submit
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' htmlType='submit'
                  disabled={reqAccessRequestPending || formSubmissionButtonDisabled}
                  loading={reqAccessRequestPending}>
                  Submit
                </Button>
              )}
              <Button htmlType='button' onClick={onReset}
                disabled={reqAccessRequestPending}>
                Reset
              </Button>
            </Space>
          </Form.Item>
          { (studyRegistrationConfig.studyRegistrationFormDisclaimerField)
              && (
                <Typography className='study-reg-disclaimer-text'>
                  {parse(studyRegistrationConfig.studyRegistrationFormDisclaimerField)}
                </Typography>
              )}
        </Form>
      </div>
    </div>
  );
};

export default StudyRegistrationRequestForm;
