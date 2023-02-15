/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
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
  Modal,
} from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import {
  PlusOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';

import './StudyRegistration.css';
import { Link, useLocation } from 'react-router-dom';
import {
  hostname, kayakoConfig, studyRegistrationConfig, useArboristUI,
} from '../localconf';
import { cleanUpFileRecord, generatePresignedURL } from './utils';
import { createKayakoTicket } from '../utils';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
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
  studyUID?: string | Number;
  studyNumber?: string;
  studyName?: string;
  studyRegistrationAuthZ?: string;
  existingDataDictionaryName?: Array<string>;
}

const DataDictionarySubmission: React.FunctionComponent<StudyRegistrationProps> = (props: StudyRegistrationProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [studyNumber, setStudyNumber] = useState<string | undefined | null>(null);
  const [studyName, setStudyName] = useState<string | undefined | null>(null);
  const [studyUID, setStudyUID] = useState<string | Number | undefined | null>(null);
  const [studyRegistrationAuthZ, setStudyRegistrationAuthZ] = useState<string | undefined | null>(null);
  const [existingDataDictionaryName, setExistingDataDictionaryName] = useState<Array<string> | undefined>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [uploading, setUploading] = useState<boolean>(false);
  const [overwriteConfirmModalVisible, setOverwriteConfirmModalVisible] = useState<boolean>(false);
  const [duplicatedDataDictionaryName, setDuplicatedDataDictionaryName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setStudyUID(locationStateData.studyUID);
    setStudyNumber(locationStateData.studyNumber);
    setStudyName(locationStateData.studyName);
    setStudyRegistrationAuthZ(locationStateData.studyRegistrationAuthZ);
    setExistingDataDictionaryName(locationStateData.existingDataDictionaryName);
  }, [location.state]);

  useEffect(() => form.resetFields(), [studyNumber, studyName, form]);

  const handleFileSizeValidation = (_, fileList: RcFile): Promise<boolean|void> => {
    const fileInfo = fileList[0];
    if (fileInfo && fileInfo.size === 0) {
      form.setFieldValue('fileList_doNotInclude', []);
      return Promise.reject('Invalid file: file is empty');
    }
    if (!fileInfo?.size) {
      form.setFieldValue('fileList_doNotInclude', []);
      return Promise.reject('Invalid file: unable to calculate file size');
    }
    if (fileInfo.size / 1024 / 1024 > 10) {
      form.setFieldValue('fileList_doNotInclude', []);
      return Promise.reject('Invalid file: file size cannot exceed 10MB');
    }
    return Promise.resolve(true);
  };

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('access', 'study_registration', studyRegistrationAuthZ, props.userAuthMapping)
    );
  };

  const uploadToS3 = (s3URL, file, progressCallback): Promise<any> => new Promise((resolve, reject) => {
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
    // antd wraps the actual File object (event.target.files) into this "originFileObj" field
    xhr.send(file.originFileObj);
  });

  const handleUpload = (formValues) => {
    setFormSubmissionStatus({ status: 'info', text: 'Preparing for upload' });
    const fileInfo = formValues.fileList_doNotInclude[0];
    if (!fileInfo?.name || !fileInfo?.originFileObj) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid file info received' });
      return;
    }
    if (!studyRegistrationAuthZ) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid authz info received' });
      return;
    }
    generatePresignedURL(fileInfo.name, studyRegistrationAuthZ, studyRegistrationConfig.dataDictionarySubmissionBucket)
      .then((data) => {
        setFormSubmissionStatus({ status: 'info', text: 'Uploading data dictionary...' });
        const { url, guid } = data;
        uploadToS3(url, fileInfo, setUploadProgress)
          .then(() => {
            setFormSubmissionStatus({ status: 'info', text: 'Finishing upload' });
            let subject = `Data dictionary submission for ${studyNumber} ${studyName}`;
            if (subject.length > KAYAKO_MAX_SUBJECT_LENGTH) {
              subject = `${subject.substring(0, KAYAKO_MAX_SUBJECT_LENGTH - 3)}...`;
            }
            const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
            const email = formValues['E-mail Address'];
            let contents = `Grant Number: ${studyNumber}\nStudy Name: ${studyName}\nEnvironment: ${hostname}\nStudy UID: ${studyUID}\nData Dictionary GUID: ${guid}`;
            Object.entries(formValues).filter(([key]) => !key.includes('_doNotInclude')).forEach((entry) => {
              const [key, value] = entry;
              contents = contents.concat(`\n${key}: ${value}`);
            });
            // This is the CLI command to kick off the argo wf from AdminVM
            const cliCmd = `argo submit -n argo --watch vlmd_submission_workflow.yaml -p data_dict_guid=${guid} -p dictionary_name="${formValues['Data Dictionary Name']}" -p study_id=${studyUID}`;
            contents = contents.concat(`\n\nCLI Command: ${cliCmd}`);
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

  const handleOk = () => {
    setOverwriteConfirmModalVisible(false);
    form.submit();
  };

  const handleCancel = () => {
    setUploading(false);
    setOverwriteConfirmModalVisible(false);
  };

  const onSubmitButtonClick = () => {
    setUploading(true);
    const ddName = form.getFieldValue('Data Dictionary Name');
    if (existingDataDictionaryName?.includes(ddName)) {
      setDuplicatedDataDictionaryName(ddName);
      setOverwriteConfirmModalVisible(true);
    } else {
      form.submit();
    }
  };

  const uploadProps: UploadProps = {
    accept: '.csv,.tsv,.json',
    maxCount: 1,
    beforeUpload: () => false,
  };

  const onFinish = (values) => {
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
              // TODO: no time commitment for file processing ATM, until we have a fully automated flow...
              subTitle='Thank you for your submission! You will be notified via e-mail when processing is completed.'
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
                <Button type='primary' key='close' onClick={() => { setUploading(false); setFormSubmissionStatus(null); }}>
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
      <Modal
        title='Confirm Overwrite'
        open={overwriteConfirmModalVisible}
        closable={false}
        footer={(
          <div className='vlmd-submit-modal-footer-btn'>
            <Button key='cancel' onClick={handleCancel}>
            No
            </Button>
            <Button key='ok' type='primary' onClick={handleOk}>
            Yes
            </Button>
          </div>
        )}
      >
        A data dictionary with the name <Text strong>{`"${duplicatedDataDictionaryName}"`}</Text> is already associated with this study, and will be overwritten by the new submission.
        Are you sure you want to overwrite <Text strong>{`"${duplicatedDataDictionaryName}"`}</Text>?
      </Modal>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form} name='vlmd-sub-form' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>Data Dictionary Submission</Divider>
          <Typography style={{ textAlign: 'center' }}>
          Data dictionaries must conform to the HEAL VLMD schema. View more information and VLMD templates <a href='https://github.com/HEAL/heal-metadata-schemas' target='_blank' rel='noreferrer'>here</a>.
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
            label='Select Data Dictionary File'
            name='fileList_doNotInclude'
            valuePropName='fileList'
            getValueFromEvent={(e: any) => e?.fileList}
            rules={[{ required: true },
              {
                validator: handleFileSizeValidation,
                validateTrigger: 'onChange',
              }]}
            extra={'Supported file types: CSV, TSV, JSON; Maximum file size: 10MB'}
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
          </Form.Item>
          {(existingDataDictionaryName?.length)
            ? (
              <Form.Item {...tailLayout}>
                <Space direction='vertical'>
                  <Typography>This study is already linked to data dictionaries with the following names:</Typography>
                  <div>{existingDataDictionaryName.map((name) => <Tag key={name}>{name}</Tag>)}</div>
                  <Typography>Using an existing name will overwrite the existing link.</Typography>
                </Space>
              </Form.Item>
            ) : null}
          <Divider plain>Administration
            <Tooltip title='This information will be used to contact you regarding your submission status. This information is not stored on the HEAL Data Platform'>
              <QuestionCircleOutlined className='study-reg-form-item__middle-icon' />
            </Tooltip>
          </Divider>
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
                  <Button type='primary' disabled>
                    Submit data dictionary
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' onClick={onSubmitButtonClick} disabled={uploading} loading={uploading}>
                  Submit data dictionary
                </Button>
              )}
            </Space>
          </Form.Item>
          { (studyRegistrationConfig.dataDictionarySubmissionDisclaimerField)
              && (
                <Typography className='study-reg-disclaimer-text'>
                  {parse(studyRegistrationConfig.dataDictionarySubmissionDisclaimerField)}
                </Typography>
              )}
        </Form>
      </div>
    </div>
  );
};

export default DataDictionarySubmission;
