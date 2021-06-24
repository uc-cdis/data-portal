import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button, Alert } from 'antd';
import Spinner from './Spinner';
import './EmailSignUpForm.less';

/**
 * EmailSignUpForm renders email signup form { email }
 * @param {dictIcons, buttons} params
 */
class EmailSignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: 'initial',
      message: '',
    };
  }
  onFinish = (values) => {
    this.setState({
      form: 'loading',
    });
    fetch(`https://api.govdelivery.com/api/v2/accounts/${this.props.account}/signup`, {
      credentials: 'include',
      headers: {
        Accept: 'application/hal+json', // may not need
        'Content-Type': 'application/json', // may not need
        'X-AUTH-TOKEN': this.props.token,
      },
      method: 'POST',
      body: JSON.stringify({
        'signup[email]': values.email,
        'signup[privacy_consent]': values.agreement,
        'signup[subscribe][topic_ids]': this.props.subscribeToTopicIdArr,
      }),
    })
      .then((json) => {
        this.setState({
          form: 'success',
          message: `${values.email} ${this.props.successMessage}`,
        });
      })
      .catch((error) => {
        this.setState({
          form: 'error',
          message: this.props.errorMessage,
        });
      });
  }
  render() {
    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: 'Not a valid email!',
      },
    };
    return (
      <div className={'emailSignUpForm'}>
        <h2>{this.props.title}</h2>
        <Form name='nest-messages' onFinish={this.onFinish} validateMessages={validateMessages} className={`formState_${this.state.form}`}>
          <Form.Item
            name={'email'}
            label={this.props.label}
            tooltip='This is a required field'
            rules={[
              {
                required: true,
                type: 'email',
              },
            ]}
          >
            <Input placeholder={this.props.placeholder} />
          </Form.Item>
          {this.props.privacyPolicyURL ?
            <Form.Item
              name='agreement'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    (value ? Promise.resolve() : Promise.reject(new Error('Accepting data privacy policy is required!'))),
                },
              ]}
            >
              <Checkbox>
                By checking this box, you consent to the <a href={this.props.privacyPolicyURL} target='_blank' rel='noreferrer'>data privacy policy.</a>
              </Checkbox>
            </Form.Item>
            : null }
          <Alert message={this.state.message} type={this.state.form} />
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {this.props.buttonText}
            </Button>
          </Form.Item>
          <Spinner />
        </Form>
      </div>
    );
  }
}

EmailSignUpForm.propTypes = {
  account: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  subscribeToTopicIdArr: PropTypes.array.isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  privacyPolicyURL: PropTypes.string,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

EmailSignUpForm.defaultProps = {
  title: 'Sign Up For Updates',
  label: 'Email Address',
  placeholder: 'example@domain.com',
  buttonText: 'Submit',
  privacyPolicyURL: null,
  successMessage: 'has been successfully subscribed',
  errorMessage: 'something went wrong, please try again',
};

export default EmailSignUpForm;
