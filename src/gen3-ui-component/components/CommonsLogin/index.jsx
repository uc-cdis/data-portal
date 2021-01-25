import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './CommonsLogin.css';

class CommonsLogin extends React.Component {
  render() {
    return (
      <div className='commons-login'>
        <div className='commons-login__info'>
          <p className='commons-login__title'>
            {this.props.title}
          </p>
          <img
            className='commons-login__logo'
            src={this.props.logoSrc}
            alt={`${this.props.title} logo`}
          />
        </div>
        <div className='commons-login__button'>
          <h4 className='commons-login__message'>
            {this.props.message}
          </h4>
          <Button
            label={this.props.buttonTitle}
            buttonType={this.props.buttonType}
            onClick={this.props.onButtonClick}
            enabled={this.props.buttonEnabled}
            isPending={this.props.isPending}
          />
        </div>
      </div>
    );
  }
}

CommonsLogin.propTypes = {
  title: PropTypes.string.isRequired,
  logoSrc: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  buttonEnabled: PropTypes.bool,
  buttonType: PropTypes.string,
  message: PropTypes.string,
  isPending: PropTypes.bool,
};

CommonsLogin.defaultProps = {
  buttonEnabled: true,
  buttonType: 'secondary',
  message: null,
  isPending: false,
};

export default CommonsLogin;
