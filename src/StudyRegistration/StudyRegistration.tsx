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
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { StudyRegistrationConfig } from './StudyRegistrationConfig';
import './StudyRegistration.css';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { useArboristUI } from '../localconf';

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
  required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */

const handleClinicalTrialIDValidation = async (_, ctID: string): Promise<boolean|void> => {
  if (!ctID) {
    return Promise.resolve(true);
  }
  const resp = await fetch(`https://clinicaltrials.gov/ct2/results?id=${ctID}`);

  if (resp?.status === 200) {
    return Promise.resolve(true);
  }
  if (resp?.status === 404) {
    return Promise.reject('Invalid ClinicalTrial.gov ID');
  }
  return Promise.reject('Unable to verify ClinicalTrial.gov ID');
};
export interface DiscoveryResource {
  [any: string]: any,
}
interface Props {
  userAuthMapping: any,
  config: StudyRegistrationConfig
  studies: DiscoveryResource[]
}

const StudyRegistration: React.FunctionComponent<Props> = (props: Props) => {
  const { studies } = props;
  const [form] = Form.useForm();

  const userHasAccess = () => {
    if (!useArboristUI) {
      return true;
    }
    return (userHasMethodForServiceOnResource('access', 'mds_gateway', '/mds_gateway', props.userAuthMapping));
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className='study-reg-container'>
      <div className='study-reg-form-container'>
        <Form className='study-reg-form' {...layout} form={form} name='control-hooks' onFinish={onFinish} validateMessages={validateMessages}>
          <Divider plain>CEDAR API</Divider>
          <Form.Item
            label='CEDAR User UUID'
            hasFeedback
            name='cedar_uuid'
            rules={[{ required: true }]}
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
              Get CEDAR User UUID
                  <ExportOutlined />
                </Typography.Link>
              </div>
            </div>
          </Form.Item>
          <Divider plain>Study Selection</Divider>
          <Form.Item
            name='study'
            label='Study'
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select placeholder='Select a study to register' showSearch allowClear>
              {studies?.map((study) => (
                <Option key={study.appl_id} value={study.appl_id}>
                  {`${study.project_num} : ${study.project_title} : ${study.appl_id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider plain>Metadata Fields</Divider>
          <Form.Item
            name='repository'
            label='Study Data Repository'
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select placeholder='Select a data repository' showSearch allowClear>
              <Option value='HEAL FAIR'>HEAL FAIR</Option>
              <Option value='JCOIN'>JCOIN</Option>
              <Option value='ICPSR'>ICPSR</Option>
              <Option value='N/A'>N/A</Option>
            </Select>
          </Form.Item>
          <Form.List name='object_ids' initialValue={['']}>
            {(fields, { add, remove }) => (
              <React.Fragment>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? layout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Object ID from Data Repository' : ''}
                    required={false}
                    key={field.key}
                  >
                    <div className='study-reg-form-item'>
                      <Form.Item
                        {...field}
                        noStyle
                      >
                        <Input
                          placeholder='Enter an object ID'
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
                Add another object ID
                  </Button>
                </Form.Item>
              </React.Fragment>
            )}
          </Form.List>
          <Form.Item
            name='ct_id'
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
          <Form.Item {...tailLayout}>
            <Space>
              {(!userHasAccess()) ? (
                <Tooltip title={'You don\'t have permission to register a study'}>
                  <Button type='primary' htmlType='submit' disabled>
                    Submit
                  </Button>
                </Tooltip>
              ) : (
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              )}
              <Button htmlType='button' onClick={onReset}>
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
