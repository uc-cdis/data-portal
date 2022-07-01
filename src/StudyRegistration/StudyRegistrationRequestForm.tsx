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
interface User {
  username: string
}
interface Props {
  user: User,
  userAuthMapping: any,
}

const StudyRegistrationRequestForm: React.FunctionComponent<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState(null);
  const [requestID, setRequestID] = useState(null);
  const [studyUID, setStudyUID] = useState(null);
  const [studyNumber, setStudyNumber] = useState(null);
  const [studyName, setStudyName] = useState(null);
  const [role, setRole] = useState('Principal Investigator');
  const [reqAccessRequestPending, setReqAccessRequestPending] = useState(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState;
    setRequestID(locationStateData.requestID);
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
  }, [location.state]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('create', 'kayako', '/kayako', props.userAuthMapping));
  };

  const handleRegisterFormSubmission = (formValues) => {
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
            name='study_grant'
            label='Study Name - Grant Number'
            initialValue={`${studyName} - ${studyNumber}`}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name='firstname'
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
            name='lastname'
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
            name='email'
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
            name='institution'
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
            name='role'
            label='Role on Project'
            initialValue={1}
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
                    <Input style={{ width: 300, marginLeft: 10 }} />
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
