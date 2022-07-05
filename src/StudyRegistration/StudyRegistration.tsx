import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Tooltip,
  Typography,
  Space,
  Result,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { StudyRegistrationConfig } from './StudyRegistrationConfig';
import './StudyRegistration.css';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { useArboristUI } from '../localconf';
import loadStudiesFromMDS from '../Discovery/MDSUtils';
import { registerStudyInMDS, preprocessStudyRegistrationMetadata, createCEDARInstance } from './utils';

const { Option } = Select;
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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 16,
    offset: 8,
  },
};
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
};
/* eslint-enable no-template-curly-in-string */

const handleClinicalTrialIDValidation = async (_, ctID: string): Promise<boolean|void> => {
  if (!ctID) {
    return Promise.resolve(true);
  }
  const resp = await fetch(`https://clinicaltrials.gov/api/query/field_values?expr=${encodeURIComponent(`SEARCH[Study](AREA[NCTId] ${ctID})`)}&field=NCTId&fmt=json`);
  if (!resp || resp.status !== 200) {
    return Promise.reject('Unable to verify ClinicalTrial.gov ID');
  }
  try {
    const respJson = await resp.json();
    if (respJson.FieldValuesResponse?.FieldValues?.length === 1 && respJson.FieldValuesResponse.FieldValues[0].FieldValue === ctID) {
      return Promise.resolve(true);
    }
    return Promise.reject('Invalid ClinicalTrial.gov ID');
  } catch {
    return Promise.reject('Unable to verify ClinicalTrial.gov ID');
  }
};

const isUUID = (input: string) => {
  // regexp for checking if a string is possibly an UUID, from https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
  const regexp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return new RegExp(regexp).test(input);
};

const handleUUIDValidation = (_, UUID: string): Promise<boolean|void> => {
  if (!UUID || !isUUID(UUID)) {
    return Promise.reject('Invalid CEDAR user UUID');
  }
  return Promise.resolve(true);
};

export interface DiscoveryResource {
  [any: string]: any,
}
interface User {
  username: string
}
interface Props {
  user: User,
  userAuthMapping: any,
  studyRegConfig: StudyRegistrationConfig
}

const StudyRegistration: React.FunctionComponent<Props> = (props: Props) => {
  const [form] = Form.useForm();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState(null);
  const [studies, setStudies] = useState(null);
  const [regRequestPending, setRegRequestPending] = useState(false);

  useEffect(() => {
    loadStudiesFromMDS('unregistered_discovery_metadata').then((rawStudies) => {
      if (!useArboristUI || !props.studyRegConfig.studyRegistrationAccessCheckField) {
        setStudies(rawStudies);
      } else {
        const studiesToSet = rawStudies.filter((study) => {
          if (!study[props.studyRegConfig.studyRegistrationAccessCheckField]) {
            return false;
          }
          return (userHasMethodForServiceOnResource('access', 'study_registration', study[props.studyRegConfig.studyRegistrationAccessCheckField], props.userAuthMapping));
        });
        setStudies(studiesToSet);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, [formSubmissionStatus]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('access', 'mds_gateway', '/mds_gateway', props.userAuthMapping) && userHasMethodForServiceOnResource('access', 'cedar', '/cedar', props.userAuthMapping));
  };

  const handleRegisterFormSubmission = (formValues) => {
    const cedarUserUUID = formValues.cedar_uuid;
    const studyID = formValues.study_id;
    setRegRequestPending(true);
    preprocessStudyRegistrationMetadata(props.user.username, studyID,
      {
        repository: formValues.repository || '',
        repository_study_ids: ((!formValues.repository_study_ids || formValues.repository_study_ids[0] === '') ? [] : formValues.repository_study_ids),
        clinical_trials_id: formValues.clinical_trials_id || '',
      }).then((preprocessedMetadata) => createCEDARInstance(cedarUserUUID, preprocessedMetadata)
      .then(() => registerStudyInMDS(studyID, preprocessedMetadata).then(() => setFormSubmissionStatus({ status: 'success' })),
        (err) => setFormSubmissionStatus({ status: 'error', text: err.message })),
    (err) => setFormSubmissionStatus({ status: 'error', text: err.message }));
  };

  const onFinish = (values) => {
    handleRegisterFormSubmission(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  if (formSubmissionStatus) {
    return (
      <div className='study-reg-container'>
        <div className='study-reg-form-container'>
          {(formSubmissionStatus.status === 'success') ? (
            <Result
              status={formSubmissionStatus.status}
              title='Your study has been registered!'
              subTitle='Please allow up to 24 hours until the platform is updated'
              extra={[
                <Button type='primary' key='register' onClick={() => { setFormSubmissionStatus(null); setRegRequestPending(false); }}>
                  Register Another Study
                </Button>,
                <Link key='discovery' to={'/discovery'}>
                  <Button>Go To Discovery Page</Button>
                </Link>,
              ]}
            />
          ) : (
            <Result
              status={formSubmissionStatus.status}
              title='A problem has occurred during registration!'
              subTitle={formSubmissionStatus.text}
              extra={[
                <Button type='primary' key='close' onClick={() => { setFormSubmissionStatus(null); setRegRequestPending(false); }}>
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
        <Form className='study-reg-form' {...layout} form={form} name='study-reg-form' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>Registration Information</Divider>
          <Form.Item
            name='study_id'
            label='Study'
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select placeholder='Select a study to register' showSearch allowClear>
              {studies?.map((study) => (
                <Option key={study.appl_id} value={study.appl_id}>
                  {`${study.project_number} : ${study.project_title} : ${study.appl_id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='CEDAR User UUID'
            hasFeedback
            name='cedar_uuid'
            rules={[
              { required: true },
              {
                validator: handleUUIDValidation,
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <div className='study-reg-form-item'>
              <Input
                placeholder='Provide your CEDAR user UUID here'
              />
              <Tooltip title='A CEDAR user UUID is required in this process so the created CEDAR instances can be shared with you. We do not save this ID on the platform'>
                <QuestionCircleOutlined className='study-reg-form-item__middle-icon' />
              </Tooltip>
              <div className='study-reg-form-item__last-item'>
                <Typography.Link href='https://cedar.metadatacenter.org/' target='_blank' rel='noreferrer'>
                  <Space>
                    Get CEDAR User UUID
                    <FontAwesomeIcon
                      icon={'external-link-alt'}
                    />
                  </Space>
                </Typography.Link>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name='clinical_trials_id'
            label='ClinicalTrials.gov ID'
            rules={[
              {
                validator: handleClinicalTrialIDValidation,
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <Input placeholder='Provide ClinicalTrials.gov ID for this study, if any' />
          </Form.Item>
          <Divider plain>Repository Information</Divider>
          <Form.Item
            name='repository'
            label='Study Data Repository'
            hasFeedback
            help='Leave this section blank if your data is not yet available'
          >
            <Select placeholder='Select a data repository' showSearch allowClear>
              <Option value='HEAL FAIR'>HEAL FAIR</Option>
              <Option value='JCOIN'>JCOIN</Option>
              <Option value='ICPSR'>ICPSR</Option>
            </Select>
          </Form.Item>
          <Form.List name='repository_study_ids' initialValue={['']}>
            {(fields, { add, remove }) => (
              <React.Fragment>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? layout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Study Data ID from Repository' : ''}
                    required={false}
                    key={field.key}
                  >
                    <div className='study-reg-form-item'>
                      <Form.Item
                        {...field}
                        noStyle
                      >
                        <Input
                          placeholder='Enter the unique ID for the study within the repository'
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className='study-reg-form-item__last-item'
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </div>
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add another study data ID
                  </Button>
                </Form.Item>
              </React.Fragment>
            )}
          </Form.List>
          <Form.Item {...tailLayout}>
            <Space>
              {(!userHasAccess()) ? (
                <Tooltip title={'You don\'t have permission to register a study'}>
                  <Button type='primary' htmlType='submit' disabled>
                    Submit
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' htmlType='submit' disabled={regRequestPending} loading={regRequestPending}>
                  Submit
                </Button>
              )}
              <Button htmlType='button' onClick={onReset} disabled={regRequestPending}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StudyRegistration;
