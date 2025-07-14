import PropTypes from 'prop-types';

const IconComponent = ({
  dictIcons, iconName, height, svgStyles,
}) => {
  if (iconName in dictIcons) {
    return dictIcons[iconName](height, svgStyles);
  }
  console.log(`${iconName} is not found in dictIcons, it will be ignored`);
  return dictIcons.blank(height, svgStyles);
};

IconComponent.propTypes = {
  iconName: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
  height: PropTypes.string,
  svgStyles: PropTypes.object,
};

IconComponent.defaultProps = {
  height: '27px',
  svgStyles: {},
};

export default IconComponent;
