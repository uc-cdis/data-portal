import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import dictIcons from '../img/icons/index';
import IconComponent from './Icon';
import './BackLink.less';

function BackLink({ url, label }) {
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
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default BackLink;
