import React, { useState } from 'react';
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
} from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import {
  PlusOutlined,
} from '@ant-design/icons';

import './StudyRegistration.css';

const { Text } = Typography;

export interface FormSubmissionState {
  status?: ResultStatusType;
  text?: string
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
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
};
/* eslint-enable no-template-curly-in-string */

const DataDictionarySubmission: React.FunctionComponent = () => {
  const [form] = Form.useForm();

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<FormSubmissionState | null>(null);

  const userHasAccess = () => true;

  const onFinish = () => {
    setFormSubmissionStatus({ status: 'success' });
    // setFormSubmissionStatus({ status: 'error', text: 'err.message' });
  };

  if (formSubmissionStatus) {
    return (
      <div className='study-reg-container'>
        <div className='study-reg-form-container'>
          {(formSubmissionStatus.status === 'success') ? (
            <Result
              status={formSubmissionStatus.status}
              title='Your Data Dictionary has been submited!'
            />
          ) : (
            <Result
              status={formSubmissionStatus.status}
              title='A problem has occurred during submition!'
              subTitle={formSubmissionStatus.text}
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
          <Divider plain>Data Dictionary Submission</Divider>
          <div className='study-reg-exp-text'><Text type='danger'>*</Text><Text type='secondary'> Indicates required fields</Text></div>
          <Form.Item
            label='Study'
            rules={[{ required: true }]}
          >
            <Input
              placeholder={'Study ID/name (pre-filled, not editable))'}
              disabled
            />
          </Form.Item>
          <Form.Item
            label='Select file'
            rules={[{ required: true }]}
          >
            <Upload>
              <Button
                icon={<PlusOutlined />}
              >
                Select file
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label='Data dictionary name'
            rules={[{ required: true }]}
          >
            <Input />
            { true
              && (
                <Typography>
                This study is already linked to data dictionaries with the following names:
                  <ul className='linked-dd-ul'>
                    <li>baseline</li>
                    <li>followup</li>
                  </ul>
                Using an existing name will overwrite the existing link.
                </Typography>
              )}
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
                <Button type='primary' htmlType='submit'>
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
