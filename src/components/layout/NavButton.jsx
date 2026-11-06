import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import IconComponent from '../Icon';
import './NavButton.less';
import ExternalLinkIndicator from '../ExternalLinkIndicator';

const NavButton = ({ dictIcons, item }) => {
  if (item.link.startsWith('http')) {
    return (
      <a target={item.newWindow ? '_blank' : '_self'} href={item.link} className={'body-typo nav-button'} rel='noopener noreferrer'>
        <div className='nav-button__icon'>
          <IconComponent iconName={item.icon} dictIcons={dictIcons} />
        </div>
        {item.name}
        {item.newWindow && <ExternalLinkIndicator />}
      </a>
    );
  }
  return (
    <NavLink
      className={'body-typo nav-button'}
      activeClassName='button-active'
      to={item.link}
      target={item.newWindow ? '_blank' : '_self'}
      rel='noopener noreferrer'
    >
      <div className='nav-button__icon'>
        <IconComponent iconName={item.icon} dictIcons={dictIcons} />
      </div>
      {item.name}
      {item.newWindow && <ExternalLinkIndicator />}
    </NavLink>
  );
};

NavButton.propTypes = {
  item: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
};

export default NavButton;
