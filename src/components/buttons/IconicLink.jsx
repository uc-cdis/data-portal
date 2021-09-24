import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import IconComponent from '../Icon';

/**
 * @typedef {Object} IconicLinkProps
 * @property {string} [buttonClassName]
 * @property {string} [caption]
 * @property {string} [className]
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} [dictIcons]
 * @property {string} [icon]
 * @property {string} [iconColor]
 * @property {boolean} [isExternal]
 * @property {string} link
 * @property {string} [target]
 */

/** @param {IconicLinkProps} props */
function IconicLink({
  buttonClassName = 'button-primary-white',
  caption = '',
  className = '',
  dictIcons,
  icon = '',
  iconColor = '',
  isExternal = false,
  link,
  target = '',
}) {
  const linkBody =
    dictIcons === undefined ? (
      caption
    ) : (
      <>
        {caption}&ensp;
        <IconComponent
          dictIcons={dictIcons}
          iconName={icon}
          height='14px'
          style={iconColor && iconColor !== '' ? { fill: iconColor } : {}}
        />
      </>
    );

  return isExternal ? (
    <a className={className} href={link} target={target}>
      {linkBody}
    </a>
  ) : (
    <Link
      className={`button ${className} ${buttonClassName}`}
      to={link}
      target={target}
    >
      {linkBody}
    </Link>
  );
}

IconicLink.propTypes = {
  buttonClassName: PropTypes.string,
  caption: PropTypes.string,
  className: PropTypes.string,
  dictIcons: PropTypes.objectOf(PropTypes.func),
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  isExternal: PropTypes.bool,
  link: PropTypes.string.isRequired,
  target: PropTypes.string,
};

export default IconicLink;
