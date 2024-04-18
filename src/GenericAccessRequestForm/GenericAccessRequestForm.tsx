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
} from 'antd';
import { useLocation } from 'react-router-dom';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { useArboristUI, studyRegistrationConfig } from '../localconf';
import {
  FormSubmissionState,
  StudyRegistrationProps,
} from './Constants/GenericFormInterfaces';
import { layout, tailLayout } from './Constants/FormLayoutConstants';
import determineSpecificFormInfo from './Constants/FormSpecificConstants';
import FormSubmissionUI from './FormSubmissionUI';
import handleRegisterFormSubmission from './handleRegisterFormSubmission';
import './GenericAccessRequestForm.css';

const { TextArea } = Input;
const { Text } = Typography;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
};
/* eslint-enable no-template-curly-in-string */

interface LocationState {
  studyUID?: string | Number;
  studyNumber?: string;
  studyName?: string;
  studyRegistrationAuthZ?: string;
}

const GenericAccessRequestForm: React.FunctionComponent<StudyRegistrationProps> = (
  props: StudyRegistrationProps,
) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [
    formSubmissionStatus,
    setFormSubmissionStatus,
  ] = useState<FormSubmissionState | null>(null);
  const [studyNumber, setStudyNumber] = useState<string | undefined | null>(
    null,
  );
  const [studyName, setStudyName] = useState<string | undefined | null>(null);
  const [studyUID, setStudyUID] = useState<string | Number | undefined | null>(
    null,
  );
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<
    string | undefined | null
  >(null);
  const [role, setRole] = useState('Principal Investigator');
  const [
    formSubmissionButtonDisabled,
    setFormSubmissionButtonDisabled,
  ] = useState(false);
  const [reqAccessRequestPending, setReqAccessRequestPending] = useState(false);
  const specificFormInfo = determineSpecificFormInfo(location.pathname);

  useEffect(() => {
    const locationStateData = (location.state as LocationState) || {};
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
    return userHasMethodForServiceOnResource(
      'create',
      'kayako',
      '/kayako',
      props.userAuthMapping,
    );
  };

  const onFinish = (values) => {
    setReqAccessRequestPending(true);
    handleRegisterFormSubmission(
      specificFormInfo,
      values,
      studyUID,
      setFormSubmissionButtonDisabled,
      setFormSubmissionStatus,
      props,
      studyRegistrationAuthZ,
      studyNumber,
      studyName,
      setReqAccessRequestPending,
      props.supportEmail,
    );
  };

  const onReset = () => {
    form.resetFields();
  };

  const onRadioChange = (e) => {
    setRole(e.target.value);
  };

  if (formSubmissionStatus) {
    return (
      <FormSubmissionUI
        specificFormInfo={specificFormInfo}
        formSubmissionStatus={formSubmissionStatus}
        setFormSubmissionStatus={setFormSubmissionStatus}
        setReqAccessRequestPending={setReqAccessRequestPending}
        supportEmail={props.supportEmail}
      />
    );
  }

  return (
    <div className='generic-access-container'>
      <div className='generic-access-form-container'>
        <Form
          className='generic-access-form'
          {...layout}
          form={form}
          name='generic-access-request-form'
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Divider plain>{specificFormInfo.title}</Divider>
          <Typography style={{ textAlign: 'center' }}>
            {specificFormInfo.description}
          </Typography>
          <Divider plain />
          <div className='generic-access-exp-text'>
            <Text type='danger'>*</Text>
            <Text type='secondary'> Indicates required fields</Text>
          </div>
          {specificFormInfo.showStudyName && (
            <Form.Item
              label='Study Name - Grant Number'
              name='Study Grant_doNotInclude'
              initialValue={
                !studyName && !studyNumber
                  ? ''
                  : `${studyName || 'N/A'} - ${studyNumber || 'N/A'}`
              }
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea disabled autoSize />
            </Form.Item>
          )}
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
          {specificFormInfo.showGrantNumber && (
            <Form.Item
              name='Grant Number'
              label='Grant Number'
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label='Role on Project'
            name='Role on Project'
            initialValue={role}
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Radio.Group onChange={onRadioChange} value={role}>
              <Space direction='vertical'>
                <Radio value={'Principal Investigator'}>
                  Principal Investigator
                </Radio>
                <Radio value={'Co-Principal Investigator'}>
                  Co-Principal Investigator
                </Radio>
                <Radio value={'Co-Investigator'}>Co-Investigator</Radio>
                <Radio value={'Administrator'}>Administrator</Radio>
                <Radio value={'Clinical Collaborator'}>
                  Clinical Collaborator
                </Radio>
                <Radio value={'Clinical Coordinator'}>
                  Clinical Coordinator
                </Radio>
                <Radio value={'Data Analyst'}>Data Analyst</Radio>
                <Radio value={'Data Manager'}>Data Manager</Radio>
                <Radio value={'Research Coordinator'}>
                  Research Coordinator
                </Radio>
                <Radio value={'Other'}>
                  Other...
                  {role === 'Other' ? (
                    <Form.Item
                      name='Custom Role'
                      noStyle
                      rules={[
                        { required: true, message: 'Please provide a role' },
                      ]}
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
              {!userHasAccess() ? (
                <Tooltip
                  title={`You don't have permission to
                  request for access`}
                >
                  <Button type='primary' htmlType='submit' disabled>
                    Submit
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={
                    reqAccessRequestPending || formSubmissionButtonDisabled
                  }
                  loading={reqAccessRequestPending}
                >
                  Submit
                </Button>
              )}
              <Button
                htmlType='button'
                onClick={onReset}
                disabled={reqAccessRequestPending}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>

          {studyRegistrationConfig.studyRegistrationFormDisclaimerField
            && specificFormInfo.showDisclaimer && (
            <Typography className='generic-access-disclaimer-text'>
              {parse(
                studyRegistrationConfig.studyRegistrationFormDisclaimerField,
              )}
            </Typography>
          )}
        </Form>
      </div>
    </div>
  );
};

export default GenericAccessRequestForm;
