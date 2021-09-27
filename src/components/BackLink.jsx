import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import dictIcons from '../img/icons/index';
import IconComponent from './Icon';
import './BackLink.less';

/**
 * @typedef {Object} BackLinkProps
 * @property {string} label
 * @property {string} url
 */

/** @param {BackLinkProps} props */
function BackLink({ label, url }) {
  return (
    <Link to={url}>
      <br />
      <div className='back-link'>
        <IconComponent dictIcons={dictIcons} iconName='back' height='12px' />
      </div>
      <div className='back-link'>{label}</div>
    </Link>
  );
}

BackLink.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default BackLink;
