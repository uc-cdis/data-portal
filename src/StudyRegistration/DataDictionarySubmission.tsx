import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Typography,
  Space,
  Result,
  Upload,
  Progress,
  Tag,
} from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import type { UploadProps } from 'antd/es/upload/interface';
import {
  PlusOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';

import './StudyRegistration.css';
import { Link, useLocation } from 'react-router-dom';
import { hostname, kayakoConfig, studyRegistrationConfig, useArboristUI } from '../localconf';
import { cleanUpFileRecord, generatePresignedURL } from './utils';
import { createKayakoTicket } from '../utils';
import { userHasDataUpload, userHasMethodForServiceOnResource } from '../authMappingUtils';
import { StudyRegistrationProps } from './StudyRegistration';

const { Text } = Typography;
const { TextArea } = Input;

export interface FormSubmissionState {
  status?: ResultStatusType;
  text?: string;
}

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
  existingDataDictionaryName?: Array<string>;
}

const DataDictionarySubmission: React.FunctionComponent<StudyRegistrationProps> = (props: StudyRegistrationProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [studyNumber, setStudyNumber] = useState<string|undefined|null>(null);
  const [studyName, setStudyName] = useState<string|undefined|null>(null);
  const [studyUID, setStudyUID] = useState<string|Number|undefined|null>(null);
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<string|undefined|null>(null);
  const [existingDataDictionaryName, setExistingDataDictionaryName] = useState<Array<string>>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
    setStudyRegistrationAuthZ(locationStateData.studyRegistrationAuthZ);
    // TODO: change this back
    setExistingDataDictionaryName(['baseline', 'followup']);
  }, [location.state]);

  useEffect(() => form.resetFields(), [studyNumber, studyName, form]);

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasDataUpload(props.userAuthMapping)
    && userHasMethodForServiceOnResource('access', 'study_registration', studyRegistrationAuthZ, props.userAuthMapping)
    );
  };

  const uploadToS3 = (s3URL, file, progressCallback):Promise<any> => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.responseText);
        }
      }
    };

    if (progressCallback) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / file.size) * 100;
          progressCallback(percentComplete);
        }
      };
    }

    xhr.open('PUT', s3URL);
    xhr.send(file);
  });

  const handleUpload = (formValues) => {
    setFormSubmissionStatus({ status: 'info', text: 'Preparing for upload' });
    const fileInfo = formValues.fileList[0];
    if (!fileInfo?.name) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid file info received' });
      return;
    }
    generatePresignedURL(fileInfo.name, studyRegistrationConfig.dataDictionarySubmissionBucket)
      .then((data) => {
        setFormSubmissionStatus({ status: 'info', text: 'Uploading data dictionary...' });
        const { url, guid } = data;
        uploadToS3(url, fileInfo, setUploadProgress)
          .then(() => {
            setFormSubmissionStatus({ status: 'info', text: 'Finishing upload' });
            // TODO: change this line back
            let subject = `DUMMY TESTING: Data dictionary submission for ${studyNumber} ${studyName}`;
            if (subject.length > KAYAKO_MAX_SUBJECT_LENGTH) {
              subject = `${subject.substring(0, KAYAKO_MAX_SUBJECT_LENGTH - 3)}...`;
            }
            const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
            const email = formValues['E-mail Address'];
            const dataDictionaryName = formValues['Data Dictionary Name'];
            let contents = `Grant Number: ${studyNumber}\nStudy Name: ${studyName}\nEnvironment: ${hostname}\nStudy UID: ${studyUID}\nData Dictionary GUID: ${guid}`;
            Object.entries(formValues).filter(([key]) => !key.includes('_doNotInclude')).forEach((entry) => {
              const [key, value] = entry;
              contents = contents.concat(`\n${key}: ${value}`);
            });
            createKayakoTicket(subject, fullName, email, contents, kayakoConfig?.kayakoDepartmentId).then(() => setFormSubmissionStatus({ status: 'success' }),
              (err) => {
                cleanUpFileRecord(guid);
                setFormSubmissionStatus({ status: 'error', text: err.message });
              });
          })
          .catch((err) => {
            cleanUpFileRecord(guid);
            setFormSubmissionStatus({ status: 'error', text: err });
          })
          .finally(() => { setUploading(false); setUploadProgress(100); });
      }, (err) => setFormSubmissionStatus({ status: 'error', text: err }));
  };

  const uploadProps: UploadProps = {
    accept: '.csv,.tsv,.json',
    maxCount: 1,
    beforeUpload: () => false,
  };
  const onFinish = (values) => {
    setUploading(true);
    handleUpload(values);
  };

  if (formSubmissionStatus) {
    switch (formSubmissionStatus.status) {
    case 'success':
      return (
        <div className='study-reg-container'>
          <div className='study-reg-form-container'>
            <Result
              status={formSubmissionStatus.status}
              title='Your Data Dictionary has been submitted!'
              subTitle='Please allow up to 48 hours before this data dictionary shows up in Discovery page'
              extra={[
                <Link key='discovery' to={'/discovery'}>
                  <Button>Go To Discovery Page</Button>
                </Link>,
              ]}
            />
          </div>
        </div>
      );
    case 'info':
      return (
        <div className='study-reg-container'>
          <div className='study-reg-form-container'>
            <Result
              status={formSubmissionStatus.status}
              title='Submitting data dictionary, please do not close this page or navigate away'
              subTitle={formSubmissionStatus.text}
              extra={<Progress percent={uploadProgress} showInfo={false} status='active' />}
            />
          </div>
        </div>
      );
    case 'error':
      return (
        <div className='study-reg-container'>
          <div className='study-reg-form-container'>
            <Result
              status={formSubmissionStatus.status}
              title='A problem has occurred during submission!'
              subTitle={formSubmissionStatus.text}
              extra={[
                <Button type='primary' key='close' onClick={() => { setFormSubmissionStatus(null); }}>
                  Close
                </Button>,
              ]}
            />
          </div>
        </div>
      );
    default:
      return null;
    }
  }

  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form} name='vlmd-sub-form' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>Data Dictionary Submission</Divider>
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
            label='Select Data Dictionary File'
            name='fileList_doNotInclude'
            valuePropName='fileList'
            getValueFromEvent={(e: any) => e?.fileList}
            rules={[{ required: true }]}
          >
            <Upload {...uploadProps}>
              <Button
                icon={<PlusOutlined />}
              >
                Select File
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name='Data Dictionary Name'
            label='Data Dictionary Name'
            rules={[{ required: true }]}
          >
            <Input />
            { (existingDataDictionaryName.length)
              && (
                <Space direction='vertical'>
                  <Typography>This study is already linked to data dictionaries with the following names:</Typography>
                  <div>{existingDataDictionaryName.map(name => <Tag>{name}</Tag>)}</div>
                  <Typography>Using an existing name will overwrite the existing link.</Typography>
                </Space>
              )}
          </Form.Item>
          <Divider plain>Administrative Fields <Tooltip title='We need these information so we can send you updates regarding your data dictionary submission. We do not save these information on the platform'>
                <QuestionCircleOutlined className='study-reg-form-item__middle-icon' />
              </Tooltip></Divider>
          <Form.Item
            name='First Name'
            label='Submitter First Name'
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
            label='Submitter Last Name'
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

          <Form.Item {...tailLayout}>
            <Space>
              {(!userHasAccess()) ? (
                <Tooltip title={'You don\'t have permission to submit data dictionary'}>
                  <Button type='primary' htmlType='submit' disabled>
                    Submit data dictionary
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' htmlType='submit' disabled={uploading} loading={uploading}>
                  Submit data dictionary
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DataDictionarySubmission;
