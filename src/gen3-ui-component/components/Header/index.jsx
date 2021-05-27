import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ logoSrc, title }) {
  return (
    <div className='header'>
      {logoSrc && (
        <div className='header__logo-container'>
          <img className='header__logo' src={logoSrc} alt={`${title} logo`} />
        </div>
      )}
      <h1 className='header__title'>{title}</h1>
    </div>
  );
}

Header.propTypes = {
  logoSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  logoSrc: null,
};

export default Header;
