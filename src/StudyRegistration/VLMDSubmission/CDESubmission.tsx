import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Form,
  Result,
  Button,
  Divider,
  Typography,
  Input,
  Space,
  Tooltip,
  Col,
  Checkbox,
  Row,
  SelectProps,
  Select,
} from 'antd';
import { parse } from 'jsonpath';
import { useLocation, Link } from 'react-router-dom';
import {
  FORM_LAYOUT,
  KAYAKO_MAX_SUBJECT_LENGTH,
  TAIL_LAYOUT,
  VALIDATE_MESSAGE,
  VLMDSubmissionProps,
} from './VLMDSubmissionTabbedPanel';
import {
  hostname, kayakoConfig, studyRegistrationConfig,
} from '../../localconf';
import { createKayakoTicket } from '../../utils';
import { FormSubmissionState } from '../StudyRegistration';

const { Text } = Typography;
const { TextArea } = Input;

interface LocationState {
    existingCDEName?: Array<string>;
}

const CDESubmission: React.FunctionComponent<VLMDSubmissionProps> = (props: VLMDSubmissionProps) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [existingCDEName, setExistingCDEName] = useState<Array<string> | undefined>([]);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    setExistingCDEName(locationStateData.existingCDEName);
  }, [location.state]);

  useEffect(() => form.resetFields(), [props.studyNumber, props.studyName, form]);

  const handleUpload = (formValues) => {
    setFormSubmissionStatus({ status: 'info', text: 'Preparing for upload' });
    const fileInfo = formValues.fileList_doNotInclude[0];
    if (!fileInfo?.name || !fileInfo?.originFileObj) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid file info received' });
      return;
    }
    if (!props.studyRegistrationAuthZ) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid authz info received' });
    }

    //     setFormSubmissionStatus({ status: 'info', text: 'Finishing upload' });
    //     let subject = `Data dictionary submission for ${props.studyNumber} ${props.studyName}`;
    //     if (subject.length > KAYAKO_MAX_SUBJECT_LENGTH) {
    //       subject = `${subject.substring(0, KAYAKO_MAX_SUBJECT_LENGTH - 3)}...`;
    //     }
    //     const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
    //     const email = formValues['E-mail Address'];
    //     let contents = `Grant Number: ${props.studyNumber}\nStudy Name: ${props.studyName}\nEnvironment: ${hostname}\nStudy UID: ${props.studyUID}\nData Dictionary GUID: ${guid}`;
    //     Object.entries(formValues).filter(([key]) => !key.includes('_doNotInclude')).forEach((entry) => {
    //       const [key, value] = entry;
    //       contents = contents.concat(`\n${key}: ${value}`);
    //     });
    //     // This is the CLI command to kick off the argo wf from AdminVM
    //     const cliCmd = `argo submit -n argo --watch HEAL-Workflows/vlmd_submission_workflows/vlmd_submission_wrapper.yaml -p data_dict_guid=${guid} -p dictionary_name="${formValues['Data Dictionary Name']}" -p study_id=${studyUID}`;
    //     contents = contents.concat(`\n\nCLI Command: ${cliCmd}`);
    //     createKayakoTicket(subject, fullName, email, contents, kayakoConfig?.kayakoDepartmentId).then(() => setFormSubmissionStatus({ status: 'success' }),
    //       (err) => {
    //         cleanUpFileRecord(guid);
    //         setFormSubmissionStatus({ status: 'error', text: err.message });
    //       });
    //   }
  };

  const onSubmitButtonClick = () => {
    setFormSubmitting(true);
    form.submit();
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
              title='Your CDE has been submitted!'
              // TODO: no time commitment for file processing ATM, until we have a fully automated flow...
              subTitle='Thank you for your submission!'
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
              title='Submitting CDE, please do not close this page or navigate away'
              subTitle={formSubmissionStatus.text}
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
                <Button type='primary' key='close' onClick={() => { setFormSubmitting(false); setFormSubmissionStatus(null); }}>
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

  const options: SelectProps['options'] = [];
  for (let i = 10; i < 36; i += 1) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...FORM_LAYOUT} form={form} name='cde-sub-form' onFinish={onFinish} validateMessages={VALIDATE_MESSAGE}>
          <Divider plain>HEAL CDEs</Divider>
          <Typography style={{ textAlign: 'center' }}>
          Use this form to indicate which HEAL Common Data Elements (CDEs) are utilized in this study (select all that apply). View the HEAL CDE Repository <a href='https://github.com/HEAL/heal-metadata-schemas' target='_blank' rel='noreferrer'>here</a>.
          </Typography>
          <Divider plain />
          <div className='study-reg-exp-text'><Text type='danger'>*</Text><Text type='secondary'> Indicates required fields</Text></div>
          <Form.Item
            label='Study Name - Grant Number'
            name='Study Grant_doNotInclude'
            initialValue={(!props.studyName && !props.studyNumber) ? '' : `${props.studyName || 'N/A'} - ${props.studyNumber || 'N/A'}`}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea disabled autoSize />
          </Form.Item>
          <Form.Item
            name='Core CDEs'
            label='Core CDEs'
            rules={[
              { required: true },
            ]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value='A' style={{ lineHeight: '32px' }}>
                A
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='B' style={{ lineHeight: '32px' }} disabled>
                B
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='C' style={{ lineHeight: '32px' }}>
                C
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='D' style={{ lineHeight: '32px' }}>
                D
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='E' style={{ lineHeight: '32px' }}>
                E
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='F' style={{ lineHeight: '32px' }}>
                F
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name='Selected CDEs'
            label='Selected CDEs'
            extra='Search and select from all CDEs'
            rules={[
              { required: true },
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Please select'
              defaultValue={['a10', 'c12']}
              options={options}
            />
          </Form.Item>
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
          <Form.Item {...TAIL_LAYOUT}>
            <Space>
              {(!props.userHasAccessToSubmit) ? (
                <Tooltip title={'You don\'t have permission to submit CDEs'}>
                  <Button type='primary' disabled>
                    Submit CDEs
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' onClick={onSubmitButtonClick} disabled={formSubmitting} loading={formSubmitting}>
                  Submit CDEs
                </Button>
              )}
            </Space>
          </Form.Item>
          { (studyRegistrationConfig.cdeSubmissionDisclaimerField)
              && (
                <Typography className='study-reg-disclaimer-text'>
                  {parse(studyRegistrationConfig.cdeSubmissionDisclaimerField)}
                </Typography>
              )}
        </Form>
      </div>
    </div>
  );
};

export default CDESubmission;
