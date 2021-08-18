import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import './EmailSignUpForm.less';

/**
 * EmailSignUpForm renders email signup form
 */
class EmailSignUpForm extends React.Component {
  render() {
    return (
      <div className={'emailSignUpForm'}>
        <h2>{this.props.title}</h2>
        <form
          action={this.props.action}
          target='_blank'
          method='post'
        >
          <input name='utf8' type='hidden' value='&#x2713;' />
          <input type='hidden' name='topic_id' id='topic_id' value={this.props.subscribeToTopicId} />
          <label> <span>{this.props.label}</span>
            <Input
              name={'email'}
              placeholder={this.props.placeholder}
            />
          </label>
          <Button type='primary' htmlType='submit' className="g3-button g3-button--primary">
            {this.props.buttonText}
          </Button>
        </form>
      </div>
    );
  }
}

EmailSignUpForm.propTypes = {
  action: PropTypes.string.isRequired,
  subscribeToTopicId: PropTypes.string.isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
};

EmailSignUpForm.defaultProps = {
  title: 'Sign Up For Updates',
  label: 'Email Address',
  placeholder: 'example@domain.com',
  buttonText: 'Submit',
};

export default EmailSignUpForm;
