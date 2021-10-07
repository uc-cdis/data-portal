import PropTypes from 'prop-types';
import React from 'react';
import IconComponent from '../Icon';

/**
 * @typedef {Object} IconicButtonProps
 * @property {string} [buttonClassName]
 * @property {string} [caption]
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} [dictIcons]
 * @property {string} [icon]
 * @property {string} [iconColor]
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick
 */

/** @param {IconicButtonProps} props */
function IconicButton({
  buttonClassName = 'button-primary-white',
  caption = '',
  dictIcons,
  icon = '',
  iconColor = '',
  onClick,
}) {
  return dictIcons === undefined ? (
    <button
      className={buttonClassName}
      name={caption}
      onClick={onClick}
      type='button'
    >
      {caption}
    </button>
  ) : (
    <button
      className={buttonClassName}
      name={caption}
      onClick={onClick}
      type='button'
    >
      {caption}&ensp;
      <IconComponent
        dictIcons={dictIcons}
        iconName={icon}
        height='14px'
        style={iconColor && iconColor !== '' ? { fill: iconColor } : {}}
      />
    </button>
  );
}

IconicButton.propTypes = {
  buttonClassName: PropTypes.string,
  caption: PropTypes.string,
  dictIcons: PropTypes.objectOf(PropTypes.func),
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default IconicButton;
