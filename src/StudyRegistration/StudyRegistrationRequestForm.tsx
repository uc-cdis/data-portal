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
import { useArboristUI } from '../localconf';
import { FormSubmissionState, StudyRegistrationProps } from './StudyRegistration';
import { createKayakoTicket } from './utils';

const { TextArea } = Input;

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
  requestID?: string;
  studyUID?: string|Number;
  studyNumber?: string;
  studyName?: string;
}

const StudyRegistrationRequestForm: React.FunctionComponent<StudyRegistrationProps> = (props: StudyRegistrationProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [requestID, setRequestID] = useState<string|undefined|null>(null);
  const [studyNumber, setStudyNumber] = useState<string|undefined|null>(null);
  const [studyName, setStudyName] = useState<string|undefined|null>(null);
  const [role, setRole] = useState('Principal Investigator');
  const [reqAccessRequestPending, setReqAccessRequestPending] = useState(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setRequestID(locationStateData.requestID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
  }, [location.state]);

  useEffect(() => form.resetFields(), [studyNumber, studyName, form]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('create', 'kayako', '/kayako', props.userAuthMapping));
  };

  const handleRegisterFormSubmission = (formValues) => {
    const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
    const email = formValues['E-mail Address'];
    const subject = `Registration Access Request for ${studyNumber} ${studyName}`;
    const contents = [`Request ID: ${requestID}`, `Grant Number: ${studyNumber}`, `Study Name: ${studyName}`];
    Object.entries(formValues).filter(([key]) => !key.includes('_doNotInclude')).forEach((entry) => {
      const [key, value] = entry;
      contents.push(`${key}: ${value}`);
    });
    createKayakoTicket(subject, fullName, email, contents, 21).then(() => setFormSubmissionStatus({ status: 'success' }),
      (err) => setFormSubmissionStatus({ status: 'error', text: err.message }));
  };

  const onFinish = (values) => {
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
              subTitle='You will be notified when a decision has been made'
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
          <Form.Item label='Role on Project'>
            <Form.Item
              name='Role on Project'
              noStyle
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
                  <Radio value={'Data Analyst<'}>Data Analyst</Radio>
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
                <Button type='primary' htmlType='submit' disabled={reqAccessRequestPending} loading={reqAccessRequestPending}>
                  Submit
                </Button>
              )}
              <Button htmlType='button' onClick={onReset} disabled={reqAccessRequestPending}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StudyRegistrationRequestForm;
