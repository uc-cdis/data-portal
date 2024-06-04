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
import { ResultStatusType } from 'antd/lib/result';
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import './StudyRegistration.css';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { useArboristUI, studyRegistrationConfig } from '../localconf';
import loadStudiesFromMDS from '../Discovery/MDSUtils';
import { registerStudyInMDS, preprocessStudyRegistrationMetadata, createCEDARInstance } from './utils';
import Spinner from '../components/Spinner';

const { Option } = Select;
const { Text } = Typography;

export interface FormSubmissionState {
  status?: ResultStatusType;
  text?: string;
}
export interface User {
  username: string
}
export interface StudyRegistrationProps {
  user: User,
  userAuthMapping: any
}
interface LocationState {
  studyUID?: string | number;
}

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
  const resp = await fetch(`https://clinicaltrials.gov/api/v2/studies/${ctID}?fields=NCTId`);
  if (!resp || resp.status !== 200) {
    return Promise.reject('Unable to verify ClinicalTrials.gov ID');
  }
  try {
    const respJson = await resp.json();
    if (respJson.protocolSection?.identificationModule?.nctId === ctID) {
      return Promise.resolve(true);
    }
    return Promise.reject('Invalid ClinicalTrials.gov ID');
  } catch {
    return Promise.reject('Unable to verify ClinicalTrials.gov ID');
  }
};

const getClinicalTrialMetadata = async (ctID: string): Promise<object> => {
  const errMsg = 'Unable to fetch study metadata from ClinicalTrials.gov';
  const clinicalTrialFieldsToFetch = studyRegistrationConfig.clinicalTrialFields || [];
  // get metadata from the clinicaltrials.gov API
  const resp = await fetch(`https://clinicaltrials.gov/api/v2/studies/${ctID}?fields=${clinicalTrialFieldsToFetch.join('|')}`);
  if (!resp || resp.status !== 200) {
    return Promise.reject('Unable to verify ClinicalTrials.gov ID');
  }
  try {
    const respJson = await resp.json();
    return respJson;
  } catch {
    throw errMsg;
  }
};

const isUUID = (input: string) => {
  // regexp for checking if a string is possibly an UUID, from https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
  const regexp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return new RegExp(regexp).test(input);
};

const handleCedarUserIdValidation = (_, UUID: string): Promise<boolean|void> => {
  if (UUID && isUUID(UUID)) {
    return Promise.resolve(true);
  }
  return Promise.reject('Invalid CEDAR user UUID');
};

const StudyRegistration: React.FunctionComponent<StudyRegistrationProps> = (props:StudyRegistrationProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [studies, setStudies] = useState<any[] | null>(null);
  const [regRequestPending, setRegRequestPending] = useState(false);
  const [studyUID, setStudyUID] = useState<string | number | undefined | null>(null);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    loadStudiesFromMDS('unregistered_discovery_metadata').then((rawStudies) => {
      if (!useArboristUI || !studyRegistrationConfig.studyRegistrationAccessCheckField) {
        setStudies(rawStudies);
      } else {
        const studiesToSet = rawStudies.filter((study) => {
          if (!study[studyRegistrationConfig.studyRegistrationAccessCheckField]) {
            return false;
          }
          return (userHasMethodForServiceOnResource('access', 'study_registration', study[studyRegistrationConfig.studyRegistrationAccessCheckField], props.userAuthMapping));
        });
        setStudies(studiesToSet);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, [formSubmissionStatus, location.state, props.userAuthMapping]);

  useEffect(() => {
    if (studies?.map((study) => study[studyRegistrationConfig.studyRegistrationUIDField]).includes(studyUID) && studyUID !== null) {
      form.resetFields();
    }
  }, [studyUID, form, studies]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    // to actually kicks off study registration request, user needs to have MDS and CEDAR access
    return (userHasMethodForServiceOnResource('access', 'mds_gateway', '/mds_gateway', props.userAuthMapping) && userHasMethodForServiceOnResource('access', 'cedar', '/cedar', props.userAuthMapping));
  };

  const handleRegisterFormSubmission = async (formValues) => {
    setRegRequestPending(true);
    const cedarUserUUID = formValues.cedar_uuid;
    const studyID = formValues.study_id;
    const ctgovID = formValues.clinical_trials_id;
    const valuesToUpdate = {
      repository: formValues.repository || '',
      repository_study_ids: ((!formValues.repository_study_ids || formValues.repository_study_ids[0] === '') ? [] : formValues.repository_study_ids),
      clinical_trials_id: ctgovID || '',
      clinicaltrials_gov: ctgovID ? await getClinicalTrialMetadata(ctgovID) : undefined,
    };
    preprocessStudyRegistrationMetadata(props.user.username, studyID, valuesToUpdate)
      .then(
        (preprocessedMetadata) => createCEDARInstance(cedarUserUUID, preprocessedMetadata)
          .then(
            (updatedMetadataToRegister) => registerStudyInMDS(studyID, updatedMetadataToRegister)
              .then(
                () => setFormSubmissionStatus({ status: 'success' }),
              ),
            (err) => setFormSubmissionStatus({ status: 'error', text: err.message }),
          ),
        (err) => setFormSubmissionStatus({ status: 'error', text: err.message }),
      );
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
                <Button type='primary' key='register' onClick={() => { setFormSubmissionStatus(null); setRegRequestPending(false); setStudyUID(undefined); }}>
                  Register Another Study
                </Button>,
                <Link key='discovery' to={'/discovery'}>
                  <Button>Go To Discovery Page</Button>
                </Link>,
                <Tooltip key='cedar-tooltip' title='Check the newly created CEDAR metadata instance on CEDAR platform. It should be available under the "Shared with Me" tab'>
                  <Button href='https://cedar.metadatacenter.org/' target='_blank' rel='noreferrer'>
                    <Space>
                      Go To CEDAR <FontAwesomeIcon icon={'external-link-alt'} />
                    </Space>
                  </Button>
                </Tooltip>,
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
  if (!studies) {
    return <Spinner text={'Loading study registration form, please wait...'} />;
  }
  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form} name='study-reg-form' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>Registration Information</Divider>
          <div className='study-reg-exp-text'><Text type='danger'>*</Text><Text type='secondary'> Indicates required fields</Text></div>
          <Form.Item
            name='study_id'
            label='Study'
            initialValue={studyUID}
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select placeholder='Select a study to register' showSearch allowClear>
              {studies?.map((study) => (
                <Option
                  key={study[studyRegistrationConfig.studyRegistrationUIDField]}
                  value={study[studyRegistrationConfig.studyRegistrationUIDField]}
                >
                  {`${study.project_number || 'N/A'} : ${study.study_metadata?.minimal_info?.study_name || 'N/A'} : ${study.study_metadata?.metadata_location?.nih_application_id || 'N/A'}`}
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
                validator: handleCedarUserIdValidation,
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
            help={(
              <React.Fragment> If you have already selected a data repository, indicate it here;
                 otherwise, leave empty.<br />
                 If you have deposited your data and you have a unique Study ID for the data at
                  the repository, enter it below; otherwise, leave blank.
              </React.Fragment>
            )}
          >
            <Select placeholder='Select a data repository' showSearch allowClear>
              <Option value='BioSystics-AP'>BioSystics-AP</Option>
              <Option value='Database of Genotypes and Phenotypes (dbGaP)'>Database of Genotypes and Phenotypes (dbGaP)</Option>
              <Option value='Dryad'>Dryad</Option>
              <Option value='Figshare'>Figshare</Option>
              <Option value='GitHub'>GitHub</Option>
              <Option value='Harvard Dataverse'>Harvard Dataverse</Option>
              <Option value='ICPSR'>ICPSR</Option>
              <Option value='ICPSR/NAHDAP'>ICPSR/NAHDAP</Option>
              <Option value='openICPSR'>openICPSR</Option>
              <Option value='JCOIN'>JCOIN</Option>
              <Option value='MassIVE'>MassIVE</Option>
              <Option value='Mendeley Data'>Mendeley Data</Option>
              <Option value='Mouse Genome Informatics (MGI)'>Mouse Genome Informatics (MGI)</Option>
              <Option value='Mouse Phenome Database (MPD)'>Mouse Phenome Database (MPD)</Option>
              <Option value='National Sleep Research Resource (NSRR)'>National Sleep Research Resource (NSRR)</Option>
              <Option value='NICHD DASH'>NICHD DASH</Option>
              <Option value='NIDA Data Share'>NIDA Data Share</Option>
              <Option value='NIDDK Central Repository'>NIDDK Central Repository</Option>
              <Option value='NIMH Data Archive'>NIMH Data Archive</Option>
              <Option value='OpenNEURO'>OpenNEURO</Option>
              <Option value='Open Science Framework'>Open Science Framework</Option>
              <Option value='Pennsieve'>Pennsieve</Option>
              <Option value='Protocols.io'>Protocols.io</Option>
              <Option value='Qualitative Data Repository at Syracuse University'>Qualitative Data Repository at Syracuse University</Option>
              <Option value='Rat Genome Database (RGD)'>Rat Genome Database (RGD)</Option>
              <Option value='Sequence Read Archive (SRA)'>Sequence Read Archive (SRA)</Option>
              <Option value='SPARC'>SPARC</Option>
              <Option value='Vivli'>Vivli</Option>
              <Option value='The Zebrafish Model Organism Database (ZFIN)'>The Zebrafish Model Organism Database (ZFIN)</Option>
              <Option value='Zenodo'>Zenodo</Option>
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
