import PropTypes from 'prop-types';
import React from 'react';
import IconComponent from '../Icon';

function IconicButton({
  onClick,
  dictIcons,
  icon,
  iconColor,
  caption,
  buttonClassName,
}) {
  let styles = {};
  if (iconColor && iconColor !== '') {
    styles = { fill: iconColor };
  }
  return dictIcons !== undefined ? (
    <button
      className={buttonClassName}
      onClick={onClick}
      name={caption}
      type='button'
    >
      {caption}&ensp;
      <IconComponent
        dictIcons={dictIcons}
        iconName={icon}
        height='14px'
        svgStyles={{ ...styles }}
      />
    </button>
  ) : (
    <button
      className={buttonClassName}
      onClick={onClick}
      name={caption}
      type='button'
    >
      {caption}
    </button>
  );
}

IconicButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  dictIcons: PropTypes.object,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  caption: PropTypes.string,
  buttonClassName: PropTypes.string,
};

IconicButton.defaultProps = {
  dictIcons: undefined,
  icon: '',
  iconColor: '',
  caption: '',
  buttonClassName: 'button-primary-white',
};

export default IconicButton;
