import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './CommonsLogin.css';

function CommonsLogin({
  title,
  logoSrc,
  buttonTitle,
  onButtonClick,
  buttonEnabled,
  buttonType,
  message,
  isPending,
}) {
  return (
    <div className='commons-login'>
      <div className='commons-login__info'>
        <p className='commons-login__title'>{title}</p>
        <img
          className='commons-login__logo'
          src={logoSrc}
          alt={`${title} logo`}
        />
      </div>
      <div className='commons-login__button'>
        <h4 className='commons-login__message'>{message}</h4>
        <Button
          label={buttonTitle}
          buttonType={buttonType}
          onClick={onButtonClick}
          enabled={buttonEnabled}
          isPending={isPending}
        />
      </div>
    </div>
  );
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
