import React from 'react';
import PropTypes from 'prop-types';
import IconComponent from '../Icon';
import './NavButton.less';

const NavButton = ({ dictIcons, item, isActive, tabIndex }) => (
  <div
    role='button'
    tabIndex={tabIndex}
    className={
      isActive ? 'body-typo button-active nav-button' : 'body-typo nav-button'
    }
  >
    <div className='nav-button__icon'>
      <IconComponent iconName={item.icon} dictIcons={dictIcons} />
    </div>
    {item.name}
  </div>
);

NavButton.propTypes = {
  item: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  tabIndex: PropTypes.number.isRequired,
};

export default NavButton;
