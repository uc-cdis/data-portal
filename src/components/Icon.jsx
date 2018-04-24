import PropTypes from 'prop-types';
import React from 'react';

const IconComponent = ({ dictIcons, iconName, height }) => {
  return dictIcons[iconName](height);
};

IconComponent.propTypes = {
  iconName: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
};

IconComponent.defaultProps = {
  height: "27px"
};

export default IconComponent;
