import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

function Footer({ logoSrc }) {
  return (
    <div className='g3-footer'>
      {logoSrc && (
        <img className='g3-footer__image' src={logoSrc} alt='gen3 footer' />
      )}
    </div>
  );
}

Footer.propTypes = {
  logoSrc: PropTypes.string,
};

Footer.defaultProps = {
  logoSrc: null,
};

export default Footer;
