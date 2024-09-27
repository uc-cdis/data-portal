import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
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
  Checkbox,
  Select,
  Row,
  Col,
} from 'antd';
import { useLocation, Link } from 'react-router-dom';
import {
  FORM_LAYOUT,
  TAIL_LAYOUT,
  VALIDATE_MESSAGE,
  VLMDSubmissionProps,
} from './VLMDSubmissionTabbedPanel';
import {
  hostname, zendeskConfig, studyRegistrationConfig,
} from '../../localconf';
import { createZendeskTicket } from '../../utils';
import { FormSubmissionState } from '../StudyRegistration';
import { loadCDEInfoFromMDS, updateCDEMetadataInMDS } from '../utils';

const { Text } = Typography;
const { TextArea } = Input;

interface LocationState {
    existingCDEName?: Array<string>;
}

const CDESubmission: React.FunctionComponent<VLMDSubmissionProps> = (props: VLMDSubmissionProps) => {
  const [cdeForm] = Form.useForm();
  const location = useLocation();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);
  const [selectedCoreCDEs, setSelectedCoreCDEs] = useState<Array<string>>([]);
  const [selectedNonCoreCDEs, setSelectedNonCoreCDEs] = useState<Array<string>>([]);
  const [cdeInfoFromMDS, setCDEInfoFromMDS] = useState<Array<any>>([]);
  const [cdeFormSubmitting, setCDEFormSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadCDEInfoFromMDS().then((cdeInfo) => {
      const updatedCDEInfo = cdeInfo?.map((entry) => ({ ...entry, option: `${entry.drupalID} ${entry.fileName}` }));
      setCDEInfoFromMDS(updatedCDEInfo);
    });
  }, []);

  useEffect(() => {
    cdeForm.setFieldsValue({
      coreCDEs: selectedCoreCDEs,
      selectedCDEs: selectedCoreCDEs?.concat(selectedNonCoreCDEs),
    });
  }, [selectedCoreCDEs, selectedNonCoreCDEs]);

  useEffect(() => {
    const locationStateData = location.state as LocationState || {};
    const existingCDENames = locationStateData.existingCDEName || [];
    if (existingCDENames) {
      setSelectedCoreCDEs(cdeInfoFromMDS?.filter((element) => (existingCDENames?.includes(element.option)) && element.isCoreCDE)
        .map((element) => element.option));
      setSelectedNonCoreCDEs(cdeInfoFromMDS?.filter((element) => (existingCDENames?.includes(element.option)) && !element.isCoreCDE)
        .map((element) => element.option));
    }
  }, [cdeInfoFromMDS, location.state]);

  useEffect(() => cdeForm.resetFields(), [props.studyNumber, props.studyName, cdeForm]);

  const handleCDEFormSubmission = (formValues) => {
    if (!props.studyRegistrationAuthZ) {
      setFormSubmissionStatus({ status: 'error', text: 'Invalid authz info received' });
    }

    const selectedCDEInfo = cdeInfoFromMDS.filter((entry) => formValues.selectedCDEs.includes(entry.option));
    updateCDEMetadataInMDS(props.studyUID, selectedCDEInfo).then(() => {
      const subject = `CDE submission for ${props.studyNumber} ${props.studyName}`;
      const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
      const email = formValues['E-mail Address'];
      const contents = `Grant Number: ${props.studyNumber}\nStudy Name: ${props.studyName}\nEnvironment: ${hostname}\nStudy UID: ${props.studyUID}\nSelected CDEs: ${formValues.selectedCDEs}\n`;
      createZendeskTicket(subject, fullName, email, contents, zendeskConfig?.zendeskSubdomainName).then(() => setFormSubmissionStatus({ status: 'success' }),
        (err) => {
          setFormSubmissionStatus({ status: 'error', text: err.message });
        });
    }, (err) => {
      setFormSubmissionStatus({ status: 'error', text: err.message });
    });
  };

  const onSubmitButtonClick = () => {
    cdeForm.submit();
  };

  const onFinish = (values) => {
    setCDEFormSubmitting(true);
    handleCDEFormSubmission(values);
  };

  if (formSubmissionStatus) {
    switch (formSubmissionStatus.status) {
    case 'success':
      return (
        <div className='vlmd-sub-container'>
          <div className='study-reg-form-container'>
            <Result
              status={formSubmissionStatus.status}
              title='Your CDE has been submitted!'
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
    case 'error':
      return (
        <div className='vlmd-sub-container'>
          <div className='study-reg-form-container'>
            <Result
              status={formSubmissionStatus.status}
              title='A problem has occurred during submission!'
              subTitle={formSubmissionStatus.text}
              extra={[
                <Button type='primary' key='close' onClick={() => { setCDEFormSubmitting(false); setFormSubmissionStatus(null); }}>
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
    <div className='vlmd-sub-container'>
      <div className='study-reg-form-container'>
        <Form
          className='study-reg-form'
          {...FORM_LAYOUT}
          form={cdeForm}
          name='cde-sub-form'
          disabled={props.disableCDESubmissionForm}
          onFinish={onFinish}
          onFinishFailed={() => { setCDEFormSubmitting(false); }}
          validateMessages={VALIDATE_MESSAGE}
          onValuesChange={(changedValues) => {
            if (Object.keys(changedValues).includes('coreCDEs')) {
              const changedCoreCDECheckboxValues = changedValues.coreCDEs;
              setSelectedCoreCDEs(changedCoreCDECheckboxValues);
            }
            if (Object.keys(changedValues).includes('selectedCDEs')) {
              const changedCDESelectValues = changedValues.selectedCDEs;
              const updatedCoreCDESelectValues: any[] = [];
              const updatedNonCoreCDEselectValues: any[] = [];
              changedCDESelectValues.forEach((element) => {
                if (cdeInfoFromMDS.findIndex((entry) => (entry.option === element && entry.isCoreCDE)) !== -1) {
                  updatedCoreCDESelectValues.push(element);
                } else {
                  updatedNonCoreCDEselectValues.push(element);
                }
              });
              setSelectedCoreCDEs(updatedCoreCDESelectValues);
              setSelectedNonCoreCDEs(updatedNonCoreCDEselectValues);
            }
          }}
        >
          <Divider plain>HEAL CDEs</Divider>
          {(props.disableCDESubmissionForm) ? (
            <Typography style={{ textAlign: 'center' }}>
              (PLACEHOLDER) This form has been disabled
            </Typography>
          ) : (
            <Typography style={{ textAlign: 'center' }}>
              Use this form to indicate which HEAL Common Data Elements (CDEs) are utilized in this study (select all that apply). View the HEAL CDE Repository <a href='https://github.com/HEAL/heal-metadata-schemas' target='_blank' rel='noreferrer'>here</a>.
            </Typography>
          )}
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
            name='coreCDEs'
            label='Core CDEs'
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {(cdeInfoFromMDS.filter((entry) => entry.isCoreCDE).map((entry, i) => (
                  <Col span={12} key={i}>
                    <Checkbox value={entry.option}>{entry.option}</Checkbox>
                  </Col>
                )))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name='selectedCDEs'
            label='All CDEs'
            extra='Search and select from all CDEs'
          >
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              options={cdeInfoFromMDS.map((entry) => ({ label: entry.option, value: entry.option }))}
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
                <Button type='primary' onClick={onSubmitButtonClick} disabled={props.disableCDESubmissionForm || cdeFormSubmitting} loading={cdeFormSubmitting}>
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
