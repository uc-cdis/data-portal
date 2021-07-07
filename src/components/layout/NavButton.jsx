import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import IconComponent from '../Icon';
import './NavButton.less';

const NavButton = ({
  dictIcons,
  item,
}) => {
  if (item.link.startsWith('http')) {
    return (
      <a
        href={item.link}
        className={'body-typo nav-button'}
      >
        <div className='nav-button__icon'>
          <IconComponent iconName={item.icon} dictIcons={dictIcons} />
        </div>
        {item.name}
      </a>
    );
  }
  return (
    <NavLink
      className={'body-typo nav-button'}
      activeClassName='button-active'
      to={item.link}
    >
      <div className='nav-button__icon'>
        <IconComponent iconName={item.icon} dictIcons={dictIcons} />
      </div>
      {item.name}
    </NavLink>
  );
};

NavButton.propTypes = {
  item: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
};

export default NavButton;
