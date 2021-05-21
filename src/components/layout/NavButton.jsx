import React from 'react';
import PropTypes from 'prop-types';
import IconComponent from '../Icon';
import './NavButton.less';

/**
 * @param {Object} props
 * @param {{ [iconName: string]: (height: string, svgStyles: Object) => SVGElement }} props.dictIcons
 * @param {string} props.icon
 * @param {string} props.name
 * @param {boolean} [props.isActive]
 */
function NavButton({ dictIcons, icon, name, isActive = false }) {
  return (
    <div
      className={
        isActive ? 'body-typo button-active nav-button' : 'body-typo nav-button'
      }
    >
      <div className='nav-button__icon'>
        <IconComponent iconName={icon} dictIcons={dictIcons} />
      </div>
      {name}
    </div>
  );
}

NavButton.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default NavButton;
